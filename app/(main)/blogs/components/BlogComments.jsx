"use client";

import {
  addBlogComment,
  fetchCommentsByServerAction,
} from "@/app/actions/blogComment.actions";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CommentItem from "./CommentItem";
import SortComment from "./SortComment";

import Spinner from "@/components/ui/Spinner";
import { Loader2, SendHorizonal } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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

  const [content, setContent] = useState(""); // New comment content
  const [isSubmitting, setIsSubmitting] = useState(false); // New comment submission state

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

  // Handle adding a new comment
  const handleAddComment = async () => {
    try {
      if (!content.trim()) return;

      setIsSubmitting(true);
      const res = await addBlogComment({ blogId, content });
      if (res?.success) {
        setComments((prev) => [res.comment, ...prev]);
        setContent("");
      } else {
        toast.error("Failed to add comment");
      }
    } catch (e) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}

        {/* Infinite scroll trigger */}
        <div ref={ref} className={isLoading ? "h-5" : ""}></div>

        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-500" />
        )}
      </div>

      {/* FIXED Bottom Input Bar  */}
      <div
        className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-900 
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

        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
            placeholder="Write a comment..."
            disabled={isSubmitting}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />

          {/* Send Icon Button */}
          <button
            disabled={isSubmitting || !content.trim()}
            onClick={handleAddComment}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
          >
            {isSubmitting ? <Spinner /> : <SendHorizonal size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogComments;
