const API_URL = import.meta.env.VITE_API_URL;

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  token: string
): Promise<{ token: string }> => {
  const res = await fetch(`${API_URL}/api/account`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  console.log(`${API_URL}/api/account`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const deleteAccount = async (
  password: string,
  token: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/api/account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
};
