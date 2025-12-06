"use client";

import { fetchCommentsByServerAction } from "@/app/actions/blogComment.actions";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CommentItem from "./CommentItem";
import SortComment from "./SortComment";

const BlogComments = ({
  blogId,
  initialComments,
  totalComments,
  initialHasMore,
  limit,
  sort,
  isCurrentUserBlogAuthor,
  currentUserImage,
}) => {
  const [comments, setComments] = useState(initialComments);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

  // Intersection Observer Hook
  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  // Reset whenever sort or limit changes
  useEffect(() => {
    setComments(initialComments);
    setPage(1);
    setHasMore(initialHasMore);
  }, [initialComments, limit, initialHasMore]);

  // Function to load the next page
  const loadMoreComments = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    const nextPage = page + 1;

    const res = await fetchCommentsByServerAction({
      blogId,
      page: nextPage,
      limit,
      sort,
    });

    if (res && res.comments?.length > 0) {
      setComments((prev) => [...prev, ...res.comments]);
      setPage(nextPage);
      setHasMore(res.hasMore);
    }
    setIsLoading(false);
  }, [blogId, page, limit, sort, hasMore, isLoading]);

  // Effect to trigger loading when the observer hits
  useEffect(() => {
    if (inView) loadMoreComments();
  }, [inView, loadMoreComments]);

  return (
    <div className="relative border-t border-gray-300 dark:border-gray-700 mt-6">
      {/* Top: Sort + Count */}
      <div className="flex justify-between items-center px-4 py-3 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-20 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Comments ({totalComments})</h2>
        <SortComment />
      </div>

      {/* Scrollable Comments Container */}
      <div className="max-h-[380px] overflow-y-auto px-4 py-3 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              isCurrentUserBlogAuthor={isCurrentUserBlogAuthor}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
        {/* Infinite scroll trigger */}
        <div ref={ref} className="h-10"></div>

        {/* Loading spinner */}
        {isLoading && <div className="w-full flex justify-center py-4"></div>}
      </div>
    </div>
  );
};

export default BlogComments;
