"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, MoreVertical } from "lucide-react";

const CommentItem = ({ comment, isCurrentUserBlogAuthor }) => {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  const canEdit = comment.isOwner; // only comment writer
  const canDelete = comment.isOwner || isCurrentUserBlogAuthor;

  const commentetorName = comment?.user?.firstName
    ? `${comment.user?.firstName} ${comment.user?.lastName}`
    : comment.user?.name;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg relative group">
      <div className="flex gap-3">
        <img
          src={comment.user.image}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex-1">
          {/* Name + badge + time */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{commentetorName}</span>

            {comment.isAuthor && (
              <span className="bg-indigo-600 text-white px-2 py-[1px] text-xs rounded">
                Author
              </span>
            )}

            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              • {timeAgo}
            </span>
          </div>

          {/* Comment text */}
          <p className="text-sm mt-1 leading-[1.4]">{comment.content}</p>

          {/* Actions  */}
          <div className="flex items-center gap-6 mt-2 text-xs text-gray-600 dark:text-gray-300">
            <button className="flex items-center gap-1 hover:text-red-500 transition">
              <Heart
                size={14}
                className={
                  comment.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                }
              />
              {comment.likesCount}
            </button>

            <button className="flex items-center gap-1 hover:text-indigo-600 transition">
              <MessageSquare size={14} />
              Reply
            </button>
          </div>
        </div>

        {(canEdit || canDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 outline-none p-1  rounded  transition ">
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
              {canEdit && (
                <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
              )}

              {canDelete && (
                <DropdownMenuItem className="text-red-500" onClick={() => {}}>
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Reply Toggle + Replies */}
      {comment.repliesCount > 0 && (
        <Accordion type="single" collapsible className="mt-3 pl-10">
          <AccordionItem value="replies">
            <AccordionTrigger className="text-xs text-indigo-600 hover:underline w-fit">
              View Replies ({comment.repliesCount})
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-3 mt-3">
                {comment.replies.map((r) => {
                  const replyCanEdit = r.isOwner;
                  const replyCanDelete = r.isOwner || isCurrentUserBlogAuthor;
                  const replyetorName = r?.user?.firstName
                    ? `${r.user?.firstName} ${r.user?.lastName}`
                    : r.user?.name;

                  return (
                    <div key={r._id} className="flex gap-3 relative group">
                      <img
                        src={r.user.image}
                        className="w-8 h-8 rounded-full"
                      />

                      <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {replyetorName}
                          </span>

                          {r.isAuthor && (
                            <span className="bg-indigo-600 text-white px-2 py-[1px] text-xs rounded">
                              Author
                            </span>
                          )}

                          {r.isOwner && (
                            <span className="text-[10px] text-gray-500">
                              (you)
                            </span>
                          )}
                        </div>

                        <p className="text-sm mt-1">{r.content}</p>
                      </div>

                      {(replyCanEdit || replyCanDelete) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="outline-none opacity-0 group-hover:opacity-100 transition p-1 rounded ">
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
                            {replyCanEdit && (
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                            )}

                            {replyCanDelete && (
                              <DropdownMenuItem className="text-red-500">
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default CommentItem;
