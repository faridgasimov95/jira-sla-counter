export interface SettingsForm {
  jiraSubdomain: string;
  jiraUsername: string;
  jiraToken: string;
  country: string;
  ignoredStatusCodes: string;
  excelPassword: string;
  priorityThresholds: { name: string; minutes: number }[];
}

export interface PriorityThreshold {
  name: string;
  minutes: number;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  optional?: boolean;
}
