import { useEffect, useRef, useState } from "react";
import { processExcelFile } from "../api/jiraApi";
import StatusNotification from "../components/Notification";
import { useAuth } from "../context/AuthContext";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [noFileWarning, setNoFileWarning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileHasWarnings, setFileHasWarnings] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Cleanup memory on unmount
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleReset = () => {
    setDownloadUrl(null);
    setFile(null);
    setNoFileWarning(false);
    setFileHasWarnings(false);
    setError(null);
    // DOM Sync: clear input value so onChange fires even if the same file is selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setNoFileWarning(true);
      return;
    }

    setIsLoading(true);
    setDownloadUrl(null);
    setFileHasWarnings(false);
    setError(null);

    try {
      // Generate the download URL

      const { blob, hasWarnings } = await processExcelFile(file, user!.token);
      setFileHasWarnings(hasWarnings);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "sla-results.xlsx";
    a.click();
  };

  return (
    <div className="flex h-full bg-background items-center justify-center">
      {downloadUrl && (
        <StatusNotification
          status="success"
          message="✓ Your file is ready for download!"
        />
      )}
      {noFileWarning && (
        <StatusNotification
          status="warning"
          message="⚠ Please select the file first!"
        />
      )}
      {fileHasWarnings && (
        <StatusNotification
          status="warning"
          message="⚠ Some tickets could not be processed. Check the Excel file for details."
          second
        />
      )}
      {error && <StatusNotification status="error" message={`❌ ${error}`} />}
      <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm w-96">
        <h1 className="text-xl font-semibold mb-4">Upload Your File</h1>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls, .xlsx"
            onChange={handleFileChange}
            hidden
          />
          <button
            onClick={() => {
              handleReset();
              fileInputRef.current?.click();
            }}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-divider text-sm text-text-base hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Choose File
          </button>
          <span className="text-sm text-text-muted flex-1 truncate">
            {file ? file.name : "No file chosen"}
          </span>

          {downloadUrl && (
            <button
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors"
              onClick={handleDownload}
            >
              Download
            </button>
          )}
          {!isLoading && !downloadUrl && (
            <button
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors"
              onClick={handleUpload}
            >
              Upload
            </button>
          )}
          {isLoading && (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Processing...</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
