import { useRef, useState } from "react";
import { StatusNotificationProps } from "../components/Notification";

export function useNotification() {
  const [notification, setNotification] =
    useState<StatusNotificationProps | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const timeoutRef1 = useRef<ReturnType<typeof setTimeout>>();
  const timeoutRef2 = useRef<ReturnType<typeof setTimeout>>();

  function showNotification(
    status: "success" | "warning" | "error",
    message: string
  ) {
    clearTimeout(timeoutRef1.current);
    clearTimeout(timeoutRef2.current);

    setIsLeaving(false);
    setNotification(null);

    setTimeout(() => {
      setNotification({ status, message });
      timeoutRef1.current = setTimeout(() => setIsLeaving(true), 3000);
      timeoutRef2.current = setTimeout(() => {
        setNotification(null);
        setIsLeaving(false);
      }, 3500);
    }, 50);
  }

  function clearNotification() {
    clearTimeout(timeoutRef1.current);
    clearTimeout(timeoutRef2.current);
    setNotification(null);
    setIsLeaving(false);
  }

  return { notification, isLeaving, showNotification, clearNotification };
}
