// components/blog/RepliesSection.jsx
"use client";

import {
  deleteReplyAction,
  editReplyAction,
} from "@/app/actions/blogComment.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import CommentInput from "./CommentInput";

const RepliesSection = ({
  reply,
  commentId,
  blogId,
  isCurrentUserBlogAuthor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleteing, setIsDeleteing] = useState(false);

  const canEdit = reply.isOwner;
  const canDelete = reply.isOwner || isCurrentUserBlogAuthor;

  const replyId = reply._id.toString();

  const replyerName = reply?.user?.firstName
    ? `${reply.user.firstName} ${reply.user.lastName}`
    : reply.user?.name;

  const handleDelete = async () => {
    try {
      const res = await deleteReplyAction({
        blogId,
        commentId,
        replyId,
      });
      if (res?.success) {
        toast.success(res?.message);
      } else {
        toast.error(res.message || "Failed to delete reply");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete reply");
    }
  };

  return (
    <div className="flex items-start bg-gray-200 dark:bg-gray-950 rounded-md relative">
      <div className="flex gap-2 p-2 flex-1">
        {/* user Images */}
        <div className="w-8 h-8 relative ">
          <Image
            src={reply.user.image || "/default-user.png"}
            alt={"user"}
            fill
            className={`rounded-full object-cover border-2  ${reply.isOwner && "border-indigo-400"}`}
          />
        </div>

        <div className="flex-1">
          {/* Name + badge + owner + time */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{replyerName}</span>

            {reply.isAuthor && (
              <span className="bg-indigo-600 text-white px-2 py-[1px] text-xs rounded">
                Author
              </span>
            )}

            {reply.isOwner && (
              <span className="text-[10px] text-gray-500">(you)</span>
            )}

            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              • {formatDistanceToNow(new Date(reply.createdAt))}
            </span>
          </div>

          {isEditing ? (
            <CommentInput
              mode="edit"
              defaultValue={reply.content}
              maxLength={200}
              onCancel={() => setIsEditing(false)}
              onSubmit={async (content) => {
                try {
                  const res = await editReplyAction({
                    blogId,
                    commentId,
                    replyId,
                    content,
                  });
                  if (res?.success) {
                    toast.success(res.message);
                    setIsEditing(false);
                    return true;
                  }
                  toast.error(res?.message || "Failed to edit Reply!");
                  return false;
                } catch (error) {
                  toast.error(error?.message || "Failed to edit Reply!");
                  return false;
                }
              }}
            />
          ) : (
            <p className="text-sm ">{reply.content}</p>
          )}

          {/*likes and reply Actions  */}
          <div className="flex items-center gap-6 mt-2 text-xs text-gray-600 dark:text-gray-300">
            <button className="flex items-center gap-1 hover:text-red-500 transition">
              <Heart
                size={14}
                className={
                  reply?.isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
                }
                // onClick={toggleReplyLike}
              />
              {reply?.likesCount || 0}
            </button>

            <button
              className="flex items-center gap-1 hover:text-indigo-600 transition"
              // onClick={() => setReplying(!replying)}
            >
              <MessageSquare size={14} />
              Reply
            </button>
          </div>
        </div>

        {(canEdit || canDelete) && !isEditing && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 outline-none p-1 rounded transition">
                  <MoreVertical
                    className="hover:scale-110 transition-all "
                    size={16}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-32 bg-white dark:bg-gray-900"
              >
                {canEdit && !showDeleteConfirm && (
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                )}

                {canDelete && !showDeleteConfirm && (
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {showDeleteConfirm && (
              <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg p-3 w-40 z-40 text-sm">
                <p className="mb-2 text-gray-800 dark:text-gray-100">
                  Are you sure?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    disabled={isDeleteing}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isDeleteing}
                    onClick={handleDelete}
                    className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RepliesSection;
