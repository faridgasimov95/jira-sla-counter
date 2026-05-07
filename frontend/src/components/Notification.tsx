type StatusNotificationProps = {
  status: "success" | "warning" | "error";
  message: string;
  second?: boolean;
};

const bgColors = {
  success: "bg-primary",
  warning: "bg-amber-500",
  error: "bg-error",
};

export default function StatusNotification({
  status,
  message,
  second = false,
}: StatusNotificationProps) {
  const bgColor =
    status === "success"
      ? bgColors.success
      : status === "warning"
      ? bgColors.warning
      : bgColors.error;

  const topPos: string = second ? "top-24" : "top-12";

  return (
    <div
      className={`fixed ${topPos} w-full text-white px-6 py-3 shadow-lg text-center ${bgColor} animate-fadeIn border-t-2 border-white/20`}
    >
      {message}
    </div>
  );
}
