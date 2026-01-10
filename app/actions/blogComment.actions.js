"use server";

import { getBlogComments } from "@/database/queries/blogs-data";
import { getCurrentUser } from "@/lib/session";
import { BlogModel } from "@/models/blog-model";
import { BlogCommentModel } from "@/models/blogComment-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

/**
 * fetchCommentsByServerAction() → its call  getBlogComments() function
 * @param {Object} payload - blogId, page, limit, sort
 * @returns {Object} - comments list with user populated + likes count + isLiked + isAuthor + replies processed
 */

export const fetchCommentsByServerAction = async (payload) => {
  // Call the server-side function
  const newComments = await getBlogComments(payload);
  return newComments;
};

/**
 * @param {String} blogId -blog id
 * @param {String} content - comment content
 * @returns {{ success: boolean,  message: string }} - success or failure message
 */

export const addBlogComment = async ({ blogId, content }) => {
  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Please login first" };

    if (!content || content.trim().length === 0)
      return { success: false, message: "Comment cannot be empty" };

    const newComment = await BlogCommentModel.create({
      blog: new mongoose.Types.ObjectId(blogId),
      user: new mongoose.Types.ObjectId(user.id),
      content,
    });

    if (!newComment)
      return { success: false, message: "Failed to add comment." };

    await BlogModel.findByIdAndUpdate(blogId, {
      $push: { comments: newComment._id },
    });

    revalidatePath(`/blogs/${blogId}`);

    return { success: true, message: "Comment added successfully." };
  } catch (error) {
    console.error("addBlogComment ERROR:", error);
    return { success: false, message: "Failed to add comment." };
  }
};

/** editBlogComment() -> action for edit a comment.
 * @param {String} blogId -blog id
 * @param {String} commentId - comment id
 * @param {String} content - comment content
 * @returns {{ success: boolean,  message: string }} - success or failure message
 */

export const editBlogComment = async ({ blogId, commentId, content }) => {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, message: "Please login first" };

    // Update only if user is the comment owner
    const updated = await BlogCommentModel.findOneAndUpdate(
      {
        _id: commentId,
        user: currentUser.id,
      },
      { content },
      { new: true }
    );

    if (!updated)
      return {
        success: false,
        message: "You are not allowed to edit this comment",
      };

    revalidatePath(`/blogs/${blogId}`);

    return { success: true, message: "Comment updated successfully." };
  } catch (error) {
    console.error("editBlogComment ERROR:", error);
    return { success: false, message: "Failed to edit comment." };
  }
};

/** deleteBlogComment() -> action for Delate a comment.
 * @param {String} blogId -blog id
 * @param {String} commentId - comment id
 * @returns {{ success: boolean,  message: string }} - success or failure message
 */

export const deleteBlogComment = async ({ blogId, commentId }) => {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, message: "Please login first" };

    // Fetch comment & blog
    const [comment, blog] = await Promise.all([
      BlogCommentModel.findById(commentId).select("user blog"),
      BlogModel.findById(blogId).select("educator"),
    ]);

    if (!comment) return { success: false, message: "Comment not found" };
    if (!blog) return { success: false, message: "Blog not found" };

    const isCommentOwner = comment.user.toString() === currentUser.id;
    const isBlogAuthor = blog.educator.toString() === currentUser.id;

    if (!isCommentOwner && !isBlogAuthor) {
      return {
        success: false,
        message: "You are not allowed to delete this comment",
      };
    }

    // Delete comment + remove from blog.comments
    await Promise.all([
      BlogCommentModel.findByIdAndDelete(commentId),
      BlogModel.findByIdAndUpdate(blogId, {
        $pull: { comments: commentId },
      }),
    ]);

    revalidatePath(`/blogs/${blogId}`);

    return { success: true, message: "Comment deleted successfully." };
  } catch (error) {
    console.error("deleteBlogComment ERROR:", error);
    return { success: false, message: "Failed to delete comment." };
  }
};

/**
 * Toggle like/unlike for a blog comment.
 * @param {String} commentId - Comment ID
 * @param {String} blogId - blogId
 * @returns {{ success: boolean,  message: string }} - success or failure message
 */

export const toggleCommentLikeAction = async ({ commentId, blogId }) => {
  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Authentication required!" };

    const comment = await BlogCommentModel.findById(commentId).select("likes");

    if (!comment) return { success: false, message: "Comment not found" };

    // Check like exist?
    const alreadyLiked = comment.likes.includes(user.id);

    // Toggle logic
    if (alreadyLiked) {
      comment.likes.pull(user.id);
    } else {
      comment.likes.push(user.id);
    }

    await comment.save();

    revalidatePath(`/blogs/${blogId}`);

    return { success: true, message: "Comment Liked!" };
  } catch (error) {
    console.log("LIKE ERROR:", error);
    return {
      success: false,
      message: "Failed to toggle like!",
    };
  }
};

/**
 * write a reply for a blog comment.
 * @param {String} commentId - Comment ID
 * @param {String} content - content
 * @param {String} blogId - blogId
 * @returns {{ success: boolean,  message: string }} - success or failure message
 */

export const addReplyAction = async ({ commentId, content, blogId }) => {
  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Login required!" };

    const updated = await BlogCommentModel.findByIdAndUpdate(
      commentId,
      {
        $push: {
          replies: { user: user.id, content },
        },
      },
      { new: true }
    );

    if (!updated) return { success: false, message: "Failed adding reply!" };

    //  Revalidate page
    revalidatePath(`/blogs/${blogId}`);

    return { success: true, message: "Replay Added successfully" };
  } catch (error) {
    return { success: false, message: error?.message || "Error adding reply" };
  }
};

/**
 * editReplyAction() -> Edit a reply inside a comment
 * @param {String} blogId - Blog ID
 * @param {String} commentId - Parent Comment ID
 * @param {String} replyId - Reply ID
 * @param {String} content - Updated reply content
 *  * @returns {{ success: boolean,  message: string }} - success or failure message
 */

export const editReplyAction = async ({
  blogId,
  commentId,
  replyId,
  content,
}) => {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, message: "Please login first" };

    // Update reply only if owner
    const updated = await BlogCommentModel.updateOne(
      {
        _id: commentId,
      },
      {
        $set: {
          "replies.$[r].content": content,
        },
      },
      {
        arrayFilters: [{ "r._id": replyId, "r.user": currentUser.id }],
      }
    );

    if (updated.modifiedCount === 0)
      return {
        success: false,
        message: "You are not allowed to edit this reply",
      };

    revalidatePath(`/blogs/${blogId}`);

    return { success: true, message: "Reply updated successfully." };
  } catch (error) {
    console.error("editReplyAction ERROR:", error);
    return { success: false, message: "Failed to edit reply." };
  }
};

/**
 * deleteReplyAction() -> Delete a reply inside a comment
 * @param {String} blogId - Blog ID
 * @param {String} commentId - Parent Comment ID
 * @param {String} replyId - Reply ID
 * @returns {{ success: boolean,  message: string }} - success or failure message
 */
export const deleteReplyAction = async ({ blogId, commentId, replyId }) => {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, message: "Please login first" };

    // Find parent comment and blog
    const parentComment =
      await BlogCommentModel.findById(commentId).select("user replies blog");

    if (!parentComment) return { success: false, message: "Comment not found" };

    const reply = parentComment.replies.id(replyId);
    if (!reply) return { success: false, message: "Reply not found" };

    const blog = await BlogModel.findById(blogId).select("educator");
    if (!blog) return { success: false, message: "Blog not found" };

    const isReplyOwner = reply.user.toString() === currentUser.id;
    const isBlogAuthor = blog.educator.toString() === currentUser.id;

    if (!isReplyOwner && !isBlogAuthor)
      return {
        success: false,
        message: "You are not allowed to delete this reply",
      };

    //  Pull reply from the array
    await BlogCommentModel.findByIdAndUpdate(commentId, {
      $pull: { replies: { _id: replyId } },
    });

    revalidatePath(`/blogs/${blogId}`);

    return { success: true, message: "Reply deleted successfully." };
  } catch (error) {
    console.error("deleteReplyAction ERROR:", error);
    return { success: false, message: "Failed to delete reply." };
  }
};
