import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { HistoryFile } from "../types/history";
import { getHistory } from "../api/historyApi";

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

  return (
    <div className="flex h-full bg-background items-start justify-center pt-16">
      <div className=" bg-surface border border-border p-8 rounded-2xl shadow-sm">
        <h1 className="text-xl font-semibold">History</h1>
        <ul>
          {history.map((file) => {
            return <li key={file.id}>{file.filename}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}
