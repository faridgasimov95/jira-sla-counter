import { useEffect, useState } from "react";
import { SettingsForm } from "../types/settings.ts";
import FormField from "../components/FormField.tsx";
import { COUNTRIES } from "../constants/countries.ts";
import { inputClass, submitButtonClass } from "../constants/styles.ts";
import {
  setSettings as apiSetSettings,
  getSettings,
} from "../api/settingsApi.ts";
import { useAuth } from "../context/AuthContext.tsx";
import StatusNotification from "../components/Notification.tsx";
import { useSettings } from "../context/SettingsContext.tsx";
import { useNotification } from "../hooks/useNotification.ts";

export default function SettingsPage() {
  const [userSettings, setUserSettings] = useState<SettingsForm>({
    jiraSubdomain: "",
    jiraUsername: "",
    jiraToken: "",
    country: "",
    ignoredStatusCodes: [],
    excelPassword: "",
    priorityThresholds: [],
  });
  const [statusCodeInput, setStatusCodeInput] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof SettingsForm, string>>
  >({});
  const { user } = useAuth();
  const { notification, isLeaving, showNotification, clearNotification } =
    useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const { handleSettingsComplete } = useSettings();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings(user!.token);
        setUserSettings({
          ...data,
          jiraSubdomain: data.jiraSubdomain ?? "",
          jiraUsername: data.jiraUsername ?? "",
          jiraToken: data.jiraToken ?? "",
          country: data.country ?? "",
          excelPassword: data.excelPassword ?? "",
          priorityThresholds: data.priorityThresholds ?? [],
          ignoredStatusCodes: data.ignoredStatusCodes ?? [],
        });
      } catch (err) {
        if (err instanceof Error) {
          showNotification("error", err.message);
        }
        console.error(err);
      }
    }
    fetchSettings();

    return () => {
      clearNotification();
    };
  }, []);

  function handleAddStatusCode() {
    const code = Number(statusCodeInput);
    if (!code || userSettings.ignoredStatusCodes.includes(code)) return;
    setUserSettings((prev) => ({
      ...prev,
      ignoredStatusCodes: [...prev.ignoredStatusCodes, code],
    }));
    setStatusCodeInput("");
  }

  function handleRemoveStatusCode(code: number) {
    setUserSettings((prev) => ({
      ...prev,
      ignoredStatusCodes: prev.ignoredStatusCodes.filter((c) => c !== code),
    }));
  }

  function handleAddPriority() {
    setUserSettings((prev) => ({
      ...prev,
      priorityThresholds: [
        ...prev.priorityThresholds,
        { id: Date.now(), name: "", minutes: 0 },
      ],
    }));
  }

  function handleRemovePriority(i: number) {
    setUserSettings((prev) => ({
      ...prev,
      priorityThresholds: prev.priorityThresholds.filter(
        (_, index: number) => index !== i
      ),
    }));
  }

  function handlePriorityChange(
    index: number,
    field: "name" | "minutes",
    value: string
  ) {
    const updated = userSettings.priorityThresholds.map((item, i) =>
      i === index
        ? { ...item, [field]: field === "minutes" ? Number(value) : value }
        : item
    );

    setUserSettings((prev) => ({
      ...prev,
      priorityThresholds: updated,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    clearNotification();
    setErrors({});
    const newErrors: Partial<Record<keyof SettingsForm, string>> = {};

    if (!userSettings.jiraSubdomain) newErrors.jiraSubdomain = "Required";
    if (!userSettings.jiraUsername) newErrors.jiraUsername = "Required";
    if (!userSettings.jiraToken) newErrors.jiraToken = "Required";
    if (!userSettings.country) newErrors.country = "Required";
    if (userSettings.priorityThresholds.some((p) => !p.name || p.minutes <= 0))
      newErrors.priorityThresholds =
        "Each threshold must have a name and minutes greater than 0";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      await apiSetSettings(userSettings, user!.token);
      handleSettingsComplete(
        !!userSettings.jiraSubdomain &&
          !!userSettings.jiraUsername &&
          !!userSettings.jiraToken &&
          !!userSettings.country
      );
      showNotification("success", "Settings saved successfully");
    } catch (err) {
      if (err instanceof Error) showNotification("error", err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full bg-background items-start justify-center pt-16">
      {notification && (
        <StatusNotification
          status={notification.status}
          message={notification.message}
          isLeaving={isLeaving}
        />
      )}
      <div className=" bg-surface border border-border p-8 rounded-2xl shadow-sm w-[480px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h1 className="text-xl font-semibold">Settings</h1>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Jira Subdomain"
              name="jira_subdomain"
              type="text"
              value={userSettings.jiraSubdomain}
              onChange={(e) => {
                setUserSettings((prev) => ({
                  ...prev,
                  jiraSubdomain: e.target.value,
                }));
              }}
              placeholder="your-domain"
              error={errors.jiraSubdomain}
            />
            <FormField
              label="Jira Username"
              name="jira_username"
              type="email"
              value={userSettings.jiraUsername}
              onChange={(e) => {
                setUserSettings((prev) => ({
                  ...prev,
                  jiraUsername: e.target.value,
                }));
              }}
              placeholder="you@company.com"
              error={errors.jiraUsername}
            />
            <div className="col-span-2">
              <FormField
                label="Jira Token"
                name="jira_token"
                type="text"
                value={userSettings.jiraToken}
                onChange={(e) => {
                  setUserSettings((prev) => ({
                    ...prev,
                    jiraToken: e.target.value,
                  }));
                }}
                placeholder="your API token"
                error={errors.jiraToken}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
                Country
              </label>
              <select
                value={userSettings.country}
                onChange={(e) => {
                  setUserSettings((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }));
                }}
                className={inputClass}
              >
                <option value="">Select a country</option>
                <option disabled>──────────</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <span className="text-xs text-error">{errors.country}</span>
              )}
            </div>
            <FormField
              label="Excel Password"
              name="excel_password"
              type="password"
              value={userSettings.excelPassword}
              onChange={(e) =>
                setUserSettings((prev) => ({
                  ...prev,
                  excelPassword: e.target.value,
                }))
              }
              optional
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide">
                Ignored Status Codes
              </span>
              <span className="text-xs text-text-muted bg-slate-100 px-1.5 py-0.5 rounded">
                optional
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={statusCodeInput}
                placeholder="e.g. 333"
                onChange={(e) => setStatusCodeInput(e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <button
                onClick={handleAddStatusCode}
                type="button"
                className="text-xs text-primary font-medium hover:opacity-75 transition-opacity"
              >
                + Add
              </button>
            </div>
            {userSettings.ignoredStatusCodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {userSettings.ignoredStatusCodes.map((code) => (
                  <div
                    key={code}
                    className="flex items-center gap-1 bg-surface border border-divider rounded-lg px-2 py-1 text-sm text-text-base"
                  >
                    <span>{code}</span>
                    <button
                      onClick={() => handleRemoveStatusCode(code)}
                      className="text-error hover:opacity-75 transition-opacity text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide">
                Priority Thresholds
              </span>
              <button
                type="button"
                onClick={handleAddPriority}
                className="text-xs text-primary font-medium hover:opacity-75 transition-opacity"
              >
                + Add
              </button>
            </div>
            {userSettings.priorityThresholds.map((priority, index) => (
              <div key={priority.id} className="flex items-center gap-2">
                <input
                  value={priority.name}
                  placeholder="Name"
                  onChange={(e) =>
                    handlePriorityChange(index, "name", e.target.value)
                  }
                  className={`${inputClass} flex-1`}
                />
                <input
                  type="number"
                  value={priority.minutes}
                  onChange={(e) =>
                    handlePriorityChange(index, "minutes", e.target.value)
                  }
                  className={`${inputClass} w-24`}
                />
                <button
                  type="button"
                  onClick={() => handleRemovePriority(index)}
                  className="text-error hover:opacity-75 transition-opacity text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            {errors.priorityThresholds && (
              <span className="text-xs text-error">
                {errors.priorityThresholds}
              </span>
            )}
          </div>
          <button
            type="submit"
            className={submitButtonClass}
            disabled={isLoading}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
