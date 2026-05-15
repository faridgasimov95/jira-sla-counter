import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { HistoryFile } from "../types/history";
import { deleteFile, downloadFile, getHistory } from "../api/historyApi";
import {
  submitButtonClass,
  tableCellClass,
  tableHeaderClass,
  tableRowClass,
} from "../constants/styles";
import StatusNotification, {
  StatusNotificationProps,
} from "../components/Notification";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryFile[]>([]);
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState<number | null>(null);
  const [notification, setNotification] =
    useState<StatusNotificationProps | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const timeoutRef1 = useRef<ReturnType<typeof setTimeout>>();
  const timeoutRef2 = useRef<ReturnType<typeof setTimeout>>();

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

  function showNotification(
    status: "success" | "warning" | "error",
    message: string
  ) {
    clearTimeout(timeoutRef1.current);
    clearTimeout(timeoutRef2.current);

    setIsLeaving(false);
    setNotification(null);

    setTimeout(() => {
      setNotification({ status, message });
      timeoutRef1.current = setTimeout(() => setIsLeaving(true), 3000);
      timeoutRef2.current = setTimeout(() => {
        setNotification(null);
        setIsLeaving(false);
      }, 3500);
    }, 50);
  }

  async function handleDownload(id: number) {
    try {
      setIsDownloading(id);
      const { blob, filename } = await downloadFile(id, user!.token);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      showNotification("success", `${filename} downloaded successfully`);
    } catch (err) {
      if (err instanceof Error) showNotification("error", err.message);
    } finally {
      setIsDownloading(null);
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await deleteFile(id, user!.token);
      setHistory((prev) => prev.filter((file) => file.id !== id));
      showNotification(
        "success",
        `${response.filename} was successfully deleted`
      );
    } catch (err) {
      if (err instanceof Error) showNotification("error", err.message);
    }
  }

  return (
    <div className="flex h-full bg-background items-start justify-center pt-16">
      {notification && (
        <StatusNotification
          status={notification.status}
          message={notification.message}
          isLeaving={isLeaving}
        />
      )}
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
                    disabled={isDownloading !== null}
                  >
                    Download
                  </button>
                </td>
                <td className={tableCellClass}>
                  <button
                    className="text-xs text-error font-medium hover:opacity-75 transition-opacity"
                    onClick={() => handleDelete(file.id)}
                  >
                    Delete
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
