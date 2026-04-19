import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setFile(null);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl ">
      <h1 className="text-xl font-bold mb-4">JIRA SLA Counter Tool</h1>
      <input
        type="file"
        accept=".xls, .xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        className="bg-yellow-500 px-2 py-1 rounded-l border-2 border-solid border-gray-400"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}
