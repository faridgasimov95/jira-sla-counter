const API_URL = import.meta.env.VITE_API_URL;

export async function getSLA(ticketID: string) {
  const res = await fetch(`${API_URL}/api/sla/${ticketID}`);
  return res.json();
}
