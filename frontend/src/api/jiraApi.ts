const API_URL = import.meta.env.VITE_API_URL;

export async function processExcelFile(
  file: File
): Promise<{ blob: Blob; hasWarnings: boolean }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/process`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  const hasWarnings = response.headers.get("X-Has-Warnings") === "true";
  const blob = await response.blob();
  return { blob, hasWarnings };
}
