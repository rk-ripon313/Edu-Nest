import { Loader2 } from "lucide-react";

const BlogsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      <p className="text-gray-600 dark:text-gray-300">Loading blogs...</p>
      <div className="space-y-3 w-full max-w-3xl">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BlogsLoading;
