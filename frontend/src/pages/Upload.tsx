import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/process`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process file");
      }

      // Download the returned file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sla-results.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl text-center">
      <h1 className="text-xl font-bold mb-4">JIRA SLA Counter Tool</h1>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".xls, .xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {isLoading && (
          <>
            <div className="w-5 h-5 border-2 border-yellow-500 border-t-1 rounded-lg animate-spin" />
            <span className="text-sm text-gray-500">Processing...</span>
          </>
        )}
        {!isLoading && (
          <button
            className="bg-yellow-500 px-2 py-1 rounded-l border-2 border-solid border-gray-400"
            onClick={handleUpload}
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
}
