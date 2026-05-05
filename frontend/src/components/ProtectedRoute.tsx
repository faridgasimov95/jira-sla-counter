import { useAuth } from "../context/AuthContext";
import Auth from "./Auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {!isAuthenticated && <Auth />}
      {isAuthenticated && children}
    </>
  );
}
