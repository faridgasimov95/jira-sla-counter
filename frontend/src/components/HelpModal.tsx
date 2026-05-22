import { useEffect, useRef } from "react";

const STEPS = [
  {
    title: "Generate a Jira API Token",
    description:
      "Go to id.atlassian.com → Security → API Tokens and create a new token.",
  },
  {
    title: "Open Setting",
    description:
      "Navigate to the Settings page and fill in your Jira Subdomain, Username and API Token. These are required to connect to your Jira.",
  },
  {
    title: "Select your Country",
    description:
      "Choose your country so public holidays are correctly excluded from SLA calculations.",
  },
  {
    title: "Configure Priority Thresholds (optional)",
    description:
      'Add priority levels (e.g. "High", "Medium") and their SLA limits in minutes. The tool will mark tickets as Overdue or Ok based on the set limits.',
  },
  {
    title: "Add tickets from Jira to Excel",
    description:
      "In Jira, add the relevant ticket number (e.g. SD-11111) to an Excel (.xlsx) file. Make sure the file includes a column named 'Key'. Also make sure you have 'P' column containing the same priority classes you filled out the form with.",
  },
  {
    title: "Upload the file",
    description:
      "Go to the Upload page, select your exported .xlsx file and click Upload. The tool will fetch each ticket's status history from Jira and calculate SLA times.",
  },
  {
    title: "Download the result",
    description:
      "Once processing is complete, the updated file will be ready for the download. It contains the original data plus SLA Elapsed Time, SLA Status, and Note columns.",
  },
  {
    title: "View past files",
    description:
      "The History page stores your previously processed files. You can re-download or delete them. Storage is limited to 1MB per account.",
  },
];

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="rounded-2xl border border-divider shadow-sm p-8 w-[32rem] flex flex-col gap-6 max-h-[70vh] backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">How to use</h2>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-base transition-colors text-sm"
        >
          ✕
        </button>
      </div>
      <ol className="flex flex-col gap-4 overflow-y-auto pr-1">
        {STEPS.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-text-base">
                {step.title}
              </span>
              <span className="text-sm text-text-muted">
                {step.description}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </dialog>
  );
}
