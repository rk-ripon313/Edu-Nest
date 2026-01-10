"use client";

import {
  addReplyAction,
  deleteBlogComment,
  editBlogComment,
  toggleCommentLikeAction,
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
import RepliesSection from "./RepliesSection";

const CommentItem = ({
  comment,
  isCurrentUserBlogAuthor,
  currentUserImage,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleteing, setIsDeleteing] = useState(false);

  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const canEdit = comment.isOwner;
  const canDelete = comment.isOwner || isCurrentUserBlogAuthor;

  const blogId = comment.blog.toString();
  const commentId = comment._id.toString();

  const commentetorName = comment?.user?.firstName
    ? `${comment.user?.firstName} ${comment.user?.lastName}`
    : comment.user?.name;

  //handle Delate a comment
  const handleDelete = async () => {
    try {
      setIsDeleteing(true);
      const res = await deleteBlogComment({ blogId, commentId });

      if (res?.success) {
        toast.success(res?.message);
        onDelete(comment._id);
      } else {
        toast.error(res?.message || "failed!");
      }
    } catch (error) {
      toast.error(error?.message || "failed!");
    } finally {
      setIsDeleteing(false);
    }
  };

  //handle toggle like
  const toggleCommentLike = async () => {
    try {
      const res = await toggleCommentLikeAction({ commentId, blogId });
      if (!res?.success) {
        toast.error(res?.message || "error");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg relative group">
      <div className="flex gap-3">
        <div className="w-9 h-9 relative ">
          <Image
            src={comment?.user?.image || "/default-user.png"}
            alt={"user"}
            fill
            className={`rounded-full object-cover border-2  ${comment.isOwner && "border-indigo-400"}`}
          />
        </div>

        <div className="flex-1">
          {/* Name + badge + owner + time */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{commentetorName}</span>

            {comment.isAuthor && (
              <span className="bg-indigo-600 text-white px-2 py-[1px] text-xs rounded">
                Author
              </span>
            )}

            {comment.isOwner && (
              <span className="text-[10px] text-gray-500">(you)</span>
            )}

            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              • {formatDistanceToNow(new Date(comment.createdAt))}
            </span>
          </div>

          {/* Edit mode */}
          {isEditing ? (
            <CommentInput
              mode="edit"
              maxLength={300}
              placeholder="Edit your comment..."
              defaultValue={comment.content}
              onCancel={() => setIsEditing(false)}
              onSubmit={async (content) => {
                try {
                  const res = await editBlogComment({
                    blogId,
                    commentId,
                    content,
                  });
                  if (res?.success) {
                    toast.success(res.message);
                    setIsEditing(false);
                    onUpdate(comment._id, content);
                    return true;
                  }
                  toast.error(res?.message || "Failed to edit comment");
                  return false;
                } catch (error) {
                  toast.error(error?.message || "Failed to edit comment");
                  return false;
                }
              }}
            />
          ) : (
            <p className="text-sm ">{comment.content}</p>
          )}

          {/*likes and reply Actions  */}
          <div className="flex items-center gap-6 mt-2 text-xs text-gray-600 dark:text-gray-300">
            <button className="flex items-center gap-1 hover:text-red-500 transition">
              <Heart
                size={14}
                className={
                  comment?.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                }
                onClick={toggleCommentLike}
              />
              {comment?.likesCount || 0}
            </button>

            <button
              className="flex items-center gap-1 hover:text-indigo-600 transition"
              onClick={() => setReplying(!replying)}
            >
              <MessageSquare size={14} />
              Reply
            </button>

            {/* Replies list toggleing */}
            {comment.replies?.length > 0 && (
              <button
                className="text-xs text-indigo-600 hover:underline"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies
                  ? "Hide Replies"
                  : `View Replies (${comment.replies.length})`}
              </button>
            )}
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

      {/* Reply Input Area */}
      {replying && (
        <div className="mt-3 ml-12 flex gap-2 justify-between items-center">
          <div className="w-8 h-8 relative ">
            <Image
              src={currentUserImage || "/default-user.png"}
              alt={"user"}
              fill
              className="rounded-full object-cover border-2 border-indigo-500"
            />
          </div>
          <CommentInput
            mode="reply"
            placeholder="Write a reply..."
            maxLength={200}
            onCancel={() => setReplying(false)}
            onSubmit={async (content) => {
              try {
                const res = await addReplyAction({
                  commentId,
                  content,
                  blogId,
                });
                if (!res.success) {
                  toast.error(res?.message || "Failed!");
                  return false;
                }
                setReplying(false);
                setShowReplies(false);
                return true;
              } catch (error) {
                toast.error(error?.message || "Failed to edit comment");
                return false;
              }
            }}
          />
        </div>
      )}

      {/* Replies Section list of reply */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="ml-12 mt-3 space-y-2">
          {comment.replies?.map((reply) => (
            <RepliesSection
              key={reply._id}
              reply={reply}
              commentId={commentId}
              blogId={blogId}
              isCurrentUserBlogAuthor={isCurrentUserBlogAuthor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
