import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {!isAuthenticated && <AuthModal />}
      {isAuthenticated && children}
    </>
  );
}
