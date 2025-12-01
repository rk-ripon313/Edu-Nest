"use client";

import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import BlogCard from "./BlogCard";

import { fetchBlogsByServerAction } from "@/app/actions/blog.actions";
import Empty from "@/components/Empty";
import { Loader2 } from "lucide-react";

const LoadMoreBlogs = ({ filterState }) => {
  const { initialBlogs, currentTab, search, currentSort, limit } = filterState;

  const [blogs, setBlogs] = useState(initialBlogs);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBlogs.length === limit);

  // Intersection Observer Hook
  const { ref, inView } = useInView({
    threshold: 0.5, // Trigger when 50% of the element is visible
  });

  // Reset state whenever filters change (this is crucial)
  useEffect(() => {
    setBlogs(initialBlogs);
    setPage(1);
    setHasMore(initialBlogs.length === limit);
  }, [initialBlogs, limit]);

  // Function to load the next page
  const loadMoreBlogs = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    const nextPage = page + 1;

    const newBlogs = await fetchBlogsByServerAction({
      currentTab,
      search,
      currentSort,
      page: nextPage,
      limit,
    });

    if (newBlogs && newBlogs.length > 0) {
      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
      setPage(nextPage);
      // If the fetched amount is less than the limit, we know it's the last page.
      if (newBlogs.length < limit) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  }, [page, hasMore, isLoading, currentTab, search, currentSort, limit]);

  // Effect to trigger loading when the observer hits
  useEffect(() => {
    if (inView) {
      loadMoreBlogs();
    }
  }, [inView, loadMoreBlogs]);

  //empty blog list.
  if (!blogs.length && !isLoading) {
    return (
      <Empty
        title="No blogs found."
        subTitle={
          currentTab === "following"
            ? "Follow educators to see following blogs."
            : "Try adjusting your search or filters."
        }
      />
    );
  }

  return (
    <>
      <div className="space-y-6  min-w-[320px]  sm:w-[380px] md:w-[600px] lg:w-[650px]  ">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>

      {/* Intersection Observer target div */}
      <div ref={ref} className="text-center py-8">
        {isLoading && (
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-500" />
        )}
        {!hasMore && blogs.length > limit && (
          <p className="text-gray-500">
            You&#39;ve reached the end of the results.
          </p>
        )}
      </div>
    </>
  );
};

export default LoadMoreBlogs;
