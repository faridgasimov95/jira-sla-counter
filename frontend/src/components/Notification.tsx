type StatusNotificationProps = {
  status: "success" | "warning" | "error";
  message: string;
};

const bgColors = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

export default function StatusNotification({
  status,
  message,
}: StatusNotificationProps) {
  const bgColor =
    status === "success"
      ? bgColors.success
      : status === "warning"
      ? bgColors.warning
      : bgColors.error;

  return (
    <div
      className={`fixed top-0 w-full bg-green-500 text-white px-6 py-3 shadow-lg animate-fadeIn text-center ${bgColor}`}
    >
      {message}
    </div>
  );
}
