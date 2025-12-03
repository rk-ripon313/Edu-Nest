"use client";

import { Heart, MessageSquare } from "lucide-react";

const BlogCardStats = ({ likesCount, commentsCount, likersDetails }) => {
  return (
    <div className="p-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
      <div
        className="flex items-center space-x-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400" // CHANGED: Cursor ও Hover যোগ করা হলো
        // onClick={handleOpenLikeList} // open like list modal
      >
        <Heart size={16} className="text-red-500 fill-red-500" />
        <span>{likesCount} Loves</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <MessageSquare size={16} className="mr-1" />
          <span>{commentsCount} Comments</span>
        </div>
      </div>
    </div>
  );
};
export default BlogCardStats;
