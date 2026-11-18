const Empty = ({
  title,
  subTitle,
  icon: Icon,
  variant = "default",
  className = "",
}) => {
  const isCompact = variant === "compact";

  return (
    <div
      id="emptyState"
      className={`flex w-full items-center justify-center text-center ${
        isCompact ? "py-8 sm:py-10" : "py-14 sm:py-16"
      } ${className}`}
    >
      <div className="px-4">
        {Icon ? (
          <div
            className={`mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-300 ${
              isCompact ? "size-14" : "size-20"
            }`}
          >
            <Icon size={isCompact ? 26 : 34} strokeWidth={1.6} />
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`mx-auto mb-4 text-gray-400 dark:text-slate-500 ${
              isCompact ? "size-16" : "size-24"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeWidth="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        )}

        <h2
          className={`font-sora font-semibold text-gray-900 dark:text-slate-100 ${
            isCompact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
          }`}
        >
          {title}
        </h2>

        {subTitle && (
          <p
            className={`mt-2 leading-relaxed text-gray-500 dark:text-slate-400 ${
              isCompact
                ? "mx-auto max-w-sm text-sm"
                : "mx-auto max-w-md text-sm sm:text-base"
            }`}
          >
            {subTitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default Empty;
