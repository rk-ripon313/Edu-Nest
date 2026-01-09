const BlogDetailsLoading = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-3xl space-y-4">
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-6 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="mt-6 h-60 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        <div className="mt-4 h-40 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default BlogDetailsLoading;
