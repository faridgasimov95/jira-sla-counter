import { useState } from "react";
import { processExcelFile } from "../api/jiraApi";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setDownloadUrl(null);

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
    URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return (
    <>
      {downloadUrl && (
        <div className="fixed top-0 w-full bg-green-500 text-white px-6 py-3 shadow-lg animate-fadeIn text-center">
          ✓ Your file is ready for download!
        </div>
      )}
      <div className="w-[480px] bg-[rgb(255,255,245)] p-6 rounded-3xl shadow-2xl text-center">
        <h1 className="text-xl font-bold mb-4">JIRA SLA Counter Tool</h1>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".xls, .xlsx"
            className="w-64"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {isLoading && (
            <>
              <div className="w-5 h-5 border-2 border-yellow-500 border-t-1 rounded-lg animate-spin" />
              <span className="text-sm text-gray-500">Processing...</span>
            </>
          )}
          {downloadUrl && (
            <button
              className="bg-green-500 text-white px-2 py-1 rounded border-2 border-solid border-gray-600"
              onClick={handleDownload}
            >
              Download
            </button>
          )}
          {!isLoading && (
            <button
              className="ml-auto bg-yellow-500 px-2 py-1 rounded border-2 border-solid border-gray-600"
              onClick={handleUpload}
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </>
  );
}
