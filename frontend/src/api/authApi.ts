import { AuthCredentials, AuthUser } from "../types/auth.ts";
const API_URL = import.meta.env.VITE_API_URL;

export async function signUp(credentials: AuthCredentials): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}

export async function signIn(credentials: AuthCredentials): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}
