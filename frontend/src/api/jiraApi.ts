const API_URL = import.meta.env.VITE_API_URL;

export async function processExcelFile(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/process`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to process file");
  return response.blob();
}
