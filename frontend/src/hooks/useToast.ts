import { useState } from "react";
import { Toast } from "../components/ToastNotification";

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLeaving, setIsLeaving] = useState(false);

  function showToast(message: string) {
    const id = Date.now();
    setIsLeaving(false);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setIsLeaving(true), 5000);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setIsLeaving(false);
    }, 5500);
  }

  return { toasts, isLeaving, showToast };
}
