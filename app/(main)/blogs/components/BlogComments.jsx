"use client";

import {
  addBlogComment,
  fetchCommentsByServerAction,
} from "@/app/actions/blogComment.actions";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CommentItem from "./CommentItem";
import SortComment from "./SortComment";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import CommentInput from "./CommentInput";

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
  const [comments, setComments] = useState(initialComments); // All loaded comments
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

  const updateComment = (commentId, newContent) => {
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, content: newContent } : c))
    );
  };

  const removeComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  return (
    <div className="relative border-t border-gray-300 dark:border-gray-700 mt-6">
      {/* Top: Sort + Count */}
      <div className="flex justify-between items-center px-4 py-3 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-20 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Comments ({totalComments})</h2>
        <SortComment />
      </div>

      {/* Scrollable Comments Container */}
      <div
        className=" max-h-[380px] overflow-y-auto px-2 py-3 space-y-2
              [scrollbar-width:thin]
              [scrollbar-color:#b3b3b3_transparent]
              [&::-webkit-scrollbar]:w-[6px]
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-[#b3b3b3]
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-[#8a8a8a]"
      >
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              isCurrentUserBlogAuthor={isCurrentUserBlogAuthor}
              onUpdate={updateComment}
              onDelete={removeComment}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}

        {/* Infinite scroll trigger */}
        <div ref={ref} className={isLoading ? "h-6" : ""}></div>

        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-500" />
        )}
      </div>

      {/* FIXED Bottom Input Bar  */}
      <div
        className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-900 
              border-t border-gray-300 dark:border-gray-700 p-3 flex gap-2 items-center
              shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.4)]"
      >
        <div className="w-9 h-9 relative ">
          <Image
            src={currentUserImage || "/default-user.png"}
            alt={"user"}
            fill
            className="rounded-full object-cover border-2 border-indigo-500"
          />
        </div>

        <CommentInput
          mode="create"
          maxLength={500}
          onSubmit={async (content) => {
            try {
              const res = await addBlogComment({ blogId, content });
              if (!res?.success) {
                toast.error(res?.message || "Failed to add comment");
                return false;
              }
              return true;
            } catch (error) {
              toast.error(error?.message || "Failed to add comment");
              return false;
            }
          }}
        />
      </div>
    </div>
  );
};

export default BlogComments;
