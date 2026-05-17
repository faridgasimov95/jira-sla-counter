export type Toast = {
  id: number;
  message: string;
};

type ToastNotificationProps = {
  toasts: Toast[];
  isLeaving: boolean;
};

export default function ToastNotification({
  toasts,
  isLeaving,
}: ToastNotificationProps) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-surface border-l-4 border-l-amber-500 border border-divider rounded-lg shadow-sm px-4 py-3 text-sm text-text-base maxw-xs ${
            isLeaving ? "animate-slideOut" : "animate-slideIn"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
