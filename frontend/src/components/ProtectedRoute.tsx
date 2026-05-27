import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Auth from "./Auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const { settingsComplete, isLoadingSettings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || isLoadingSettings) return;
    if (!settingsComplete && location.pathname !== "/settings") {
      navigate("/settings");
    }
  }, [isAuthenticated, isLoadingSettings, settingsComplete, location.pathname]);

  if (!isAuthenticated) return <Auth />;
  if (isLoadingSettings) return null;

  return <>{children}</>;
}
