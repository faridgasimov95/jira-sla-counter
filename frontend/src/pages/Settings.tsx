import { useState } from "react";
import { SettingsForm } from "../types/settings.ts";
import FormField from "../components/FormField.tsx";
import { COUNTRIES } from "../constants/countries.ts";

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

  return (
    <div className="flex h-full bg-background items-start justify-center pt-16">
      <div className="flex flex-col gap-6 bg-surface border border-border p-8 rounded-2xl shadow-sm w-[480px]">
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
              className="border border-divider rounded-lg px-3 py-2 text-sm text-text-base outline-none focus:border-primary transition-colors bg-transparent"
            >
              <option value="AZ">Azerbaijan</option>
              <option disabled>──────────</option>
              {COUNTRIES.filter((c) => c.code !== "AZ").map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
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
              className="border border-divider rounded-lg px-3 py-2 text-sm text-text-base outline-none focus:border-primary transition-colors bg-transparent flex-1"
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
            <div className="flex gap-1">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wide">
                Priority Thresholds
              </span>
            </div>
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
                className="border border-divider rounded-lg px-3 py-2 text-sm text-text-base outline-none focus:border-primary transition-colors bg-transparent flex-1"
              />
              <input
                type="number"
                value={priority.minutes}
                onChange={(e) =>
                  handlePriorityChange(index, "minutes", e.target.value)
                }
                className="border border-divider rounded-lg px-3 py-2 text-sm text-text-base outline-none focus:border-primary transition-colors bg-transparent w-24"
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
        </div>
      </div>
    </div>
  );
}
