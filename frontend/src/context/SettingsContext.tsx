import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { getSettings } from "../api/settingsApi";

interface SettingContextType {
  settingsComplete: boolean;
  isLoadingSettings: boolean;
  handleSettingsComplete: (complete: boolean) => void;
}

export const SettingsContext = createContext<SettingContextType | null>(null);

export default function SettingsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settingsComplete, setSettingsComplete] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function fetchSettings() {
      try {
        const data = await getSettings(user!.token);
        setSettingsComplete(
          !!data.jiraSubdomain &&
            !!data.jiraUsername &&
            !!data.jiraToken &&
            !!data.country
        );
      } catch {
        setSettingsComplete(false);
      } finally {
        setIsLoadingSettings(false);
      }
    }
    fetchSettings();
  }, [user]);

  function handleSettingsComplete(complete: boolean) {
    setSettingsComplete(complete);
  }

  const ctxValue = {
    settingsComplete,
    isLoadingSettings,
    handleSettingsComplete,
  };

  return (
    <SettingsContext.Provider value={ctxValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error(
      "useSettings must be used together with SettingsContextProvider"
    );
  return ctx;
}
