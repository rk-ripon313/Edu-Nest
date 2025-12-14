const EducatorsPageLoading = () => {
  return (
    <div className="px-4 py-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6 space-y-3">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Search + Sort Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="h-10 w-full sm:w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full sm:w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Educator Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-white dark:bg-gray-800 shadow-sm p-4 space-y-3"
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Button */}
            <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded mt-3"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EducatorsPageLoading;
