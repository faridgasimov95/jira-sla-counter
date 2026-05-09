import { SettingsForm } from "../types/settings";

const API_URL = import.meta.env.VITE_API_URL;

export async function setSettings(
  settings: SettingsForm,
  token: string
): Promise<SettingsForm> {
  const response = await fetch(`${API_URL}/api/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(settings),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}

export async function getSettings(token: string): Promise<SettingsForm> {
  const response = await fetch(`${API_URL}/api/settings`, {
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
