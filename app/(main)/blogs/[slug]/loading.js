const BlogDetailsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 max-w-3xl mx-auto">
      <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-6 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

      <div className="mt-6 h-60 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="mt-4 h-40 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  );
};

export default BlogDetailsLoading;
