import { HistoryFile } from "../types/history";

const API_URL = import.meta.env.VITE_API_URL;

export async function getHistory(token: string): Promise<HistoryFile[]> {
  const response = await fetch(`${API_URL}/api/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}

export async function downloadFile(
  fileId: number,
  token: string
): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch(`${API_URL}/api/history/${fileId}/download`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  const contentDisposition = response.headers.get("Content-Disposition");
  const filename = contentDisposition
    ? contentDisposition.split("filename=")[1]
    : "sla-results.xlsx";
  const blob = await response.blob();
  return { blob, filename };
}

export async function deleteFile(
  fileId: number,
  token: string
): Promise<{ filename: string }> {
  const response = await fetch(`${API_URL}/api/history/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}
