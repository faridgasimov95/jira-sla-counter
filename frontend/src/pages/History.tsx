import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { HistoryFile } from "../types/history";
import { downloadFile, getHistory } from "../api/historyApi";
import {
  submitButtonClass,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
} from "../constants/styles";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryFile[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getHistory(user!.token);
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchHistory();
  }, []);

  async function handleDownload(id: number) {
    const { blob, filename } = await downloadFile(id, user!.token);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full bg-background items-start justify-center pt-16">
      <div className=" bg-surface border border-border p-8 rounded-2xl shadow-sm w-[45rem]">
        <h1 className="text-xl font-semibold mb-4 ">History</h1>
        <table className="w-full">
          <thead>
            <tr className={tableRowClass}>
              <th className={tableHeaderClass}>Filename</th>
              <th className={tableHeaderClass}>Date</th>
              <th className={tableHeaderClass}>Size</th>
              <th className={tableHeaderClass}></th>
            </tr>
          </thead>
          <tbody>
            {history.map((file) => (
              <tr key={file.id} className={tableRowClass}>
                <td className={tableCellClass}>{file.filename}</td>
                <td className={tableCellClass}>
                  {new Date(file.savedAt).toLocaleString()}
                </td>
                <td className={tableCellClass}>
                  {(file.size / 1024).toFixed(1) + " KB"}
                </td>
                <td className={tableCellClass}>
                  <button
                    className={submitButtonClass}
                    onClick={() => handleDownload(file.id)}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
