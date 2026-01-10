const DashboardLoading = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      {[...Array(5)].map((_, idx) => (
        <div
          key={idx}
          className="p-4 border rounded-lg shadow animate-pulse bg-gray-100 dark:bg-slate-800"
        >
          <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};

export default DashboardLoading;
