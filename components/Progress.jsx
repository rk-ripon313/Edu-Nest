"use client";

const Progress = ({ value = 0, variant = "success" }) => {
  const bgColor =
    variant === "success"
      ? "bg-green-500"
      : variant === "warning"
        ? "bg-yellow-400"
        : "bg-blue-500";

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <div
        className={`${bgColor} h-3 rounded-full transition-all duration-300`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default Progress;
