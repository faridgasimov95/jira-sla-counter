type StatusNotificationProps = {
  status: "success" | "warning" | "error";
  message: string;
  second?: boolean;
};

const bgColors = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
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
      className={`fixed ${topPos} w-full bg-green-500 text-white px-6 py-3 shadow-lg text-center ${bgColor} animate-fadeIn `}
    >
      {message}
    </div>
  );
}
