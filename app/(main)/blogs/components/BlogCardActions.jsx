"use client";

import { toggleLikeAction } from "@/app/actions/blog.actions";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const BlogCardActions = ({ blogId, isLiked = fasle, slug, blogTitle }) => {
  const [liked, setLiked] = useState(isLiked);

  const handleLikeToggle = async () => {
    try {
      const toggleLike = await toggleLikeAction(blogId);
      if (toggleLike?.success) {
        setLiked(toggleLike.liked);
      } else {
        toast.error(toggleLike.message || "Failed to update like status.");
      }
    } catch (error) {
      toast.error("An error occurred while updating like status.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: blogTitle || "Check out this blog post!",
      text: "I found this blog interesting and thought you might like it too.",
      url: `${window.location.origin}/blogs/${slug}`,
    };

    try {
      //  Web Share API Check
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Blog shared successfully!");
      }
      //  Fallback: Copy to Clipboard
      else {
        await navigator.clipboard.writeText(shareData.shareUrl);
        toast.success("Link copied to clipboard! Share it anywhere.");
      }
    } catch (error) {
      // User cancelled share or other error
      if (error.name !== "AbortError") {
        toast.error("Could not share. Please copy the link manually.");
      }
    }
  };

  return (
    <div className="flex divide-x divide-gray-200 dark:divide-gray-700 text-gray-600 dark:text-gray-300">
      {/* Like Button */}
      <button
        className={`flex-1 p-3 flex justify-center items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-bl-lg transition
               ${liked ? "text-red-500 dark:text-red-400" : "text-gray-600 dark:text-gray-300"}`}
        onClick={handleLikeToggle}
      >
        <Heart
          size={20}
          className={liked ? "fill-red-500 dark:fill-red-400" : "fill-none"}
        />
        <span className="font-medium">Love</span>
      </button>
      {/* Comment Button */}
      <Link
        href={`/blogs/${slug}`}
        className="flex-1 p-3 flex justify-center items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <MessageSquare size={20} />
        <span className="font-medium">Comment</span>
      </Link>
      {/* Share Button */}
      <button
        className="flex-1 p-3 flex justify-center items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-br-lg transition"
        onClick={handleShare}
      >
        <Share2 size={20} />
        <span className="font-medium">Share</span>
      </button>
    </div>
  );
};
export default BlogCardActions;
