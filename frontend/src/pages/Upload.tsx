import { useEffect, useRef, useState } from "react";
import { processExcelFile } from "../api/jiraApi";
import StatusNotification from "../components/Notification";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [noFileWarning, setNoFileWarning] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setNoFileWarning(false);

    try {
      // Generate the download URL
      const blob = await processExcelFile(file);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
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
    <>
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
      <div className="w-1/4 bg-[rgb(255,255,245)] p-6 rounded-3xl shadow-2xl text-center">
        <h1 className="text-xl font-bold mb-4">JIRA SLA Counter Tool</h1>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls, .xlsx"
            className="w-64"
            onChange={handleFileChange}
            hidden
          />
          <button
            onClick={() => {
              handleReset();
              fileInputRef.current?.click();
            }}
            disabled={isLoading}
            className="px-3 py-1 rounded border-2 border-solid border-gray-600 bg-gray-200 disabled:opacity-50"
          >
            Choose File
          </button>
          <div className="w-1/4 truncate">
            {file ? file.name : "No file chosen"}
          </div>

          {downloadUrl && (
            <button
              className="px-3 py-1 rounded border-2 border-solid border-gray-600 bg-green-500 text-white"
              onClick={handleDownload}
            >
              Download
            </button>
          )}
          {!isLoading && (
            <button
              className="px-3 py-1 rounded border-2 border-solid border-gray-600 bg-yellow-500 ml-auto"
              onClick={handleUpload}
            >
              Upload
            </button>
          )}
          {isLoading && (
            <>
              <div className="w-6 h-6 ml-auto border-2 border-yellow-500 rounded-lg animate-spin" />
              <span className="text-sm text-gray-600">Processing...</span>
            </>
          )}
        </div>
      </div>
    </>
  );
}
