import { useState } from "react";
import { SettingsForm } from "../types/settings.ts";

export default function SettingsPage() {
  const [userSettings, setUserSettings] = useState<SettingsForm>({
    jiraSubdomain: "",
    jiraUsername: "",
    jiraToken: "",
    country: "",
    ignoredStatusCodes: "",
    excelPassword: "",
    priorityThresholds: [],
  });

  function handleAddPriority() {
    setUserSettings((prev) => ({
      ...prev,
      priorityThresholds: [
        ...prev.priorityThresholds,
        { name: "", minutes: 0 },
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
      i === index ? { ...item, [field]: value } : item
    );

    setUserSettings((prev) => ({
      ...prev,
      priorityThresholds: updated,
    }));
  }

  return (
    <div className="flex h-full bg-background items-center justify-center">
      <div className="bg-surface border border-border p-8 rounded-2xl shadow-sm w-96">
        <h1 className="text-xl font-semibold mb-4">Settings</h1>
      </div>
    </div>
  );
}
