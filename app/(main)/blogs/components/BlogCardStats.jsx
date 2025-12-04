"use client";

import { Heart, MessageSquare } from "lucide-react";
import { useState } from "react";
import LikesListModal from "./LikesListModal";

const BlogCardStats = ({ likesCount, commentsCount, likersDetails }) => {
  const [showLikesModal, setShowLikesModal] = useState(false);

  return (
    <>
      <div className="p-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
        <div
          className="flex items-center space-x-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400" // CHANGED: Cursor ও Hover যোগ করা হলো
          onClick={() => setShowLikesModal(true)}
        >
          <Heart size={16} className="text-red-500 fill-red-500" />
          <span className="hover:underline">{likesCount} Loves</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-1" />
            <span>{commentsCount} Comments</span>
          </div>
        </div>
      </div>

      <LikesListModal
        open={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        likers={likersDetails}
      />
    </>
  );
};
export default BlogCardStats;
