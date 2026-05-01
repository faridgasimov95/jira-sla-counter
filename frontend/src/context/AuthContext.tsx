import { createContext, useContext, useState } from "react";
import { AuthUser } from "../types/auth.ts";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (email: string, token: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });
  const isAuthenticated = user !== null;

  function handleSignIn(email: string, token: string) {
    setUser({ email, token });
    localStorage.setItem("auth", JSON.stringify({ email, token }));
  }

  function handleSignOut() {
    setUser(null);
    localStorage.removeItem("auth");
  }

  const ctxValue = {
    user,
    isAuthenticated,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used together with AuthProvider");
  return ctx;
}
