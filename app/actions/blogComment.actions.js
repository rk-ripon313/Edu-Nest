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
 * @returns {string} - success or failure message
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
 * @returns {string} - success or failure message
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
 * @returns {string} - success or failure message
 */

export const deleteBlogComment = async ({ blogId, commentId }) => {
  try {
    await dbConnect();

    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, message: "Please login first" };

    //  Find the comment
    const comment =
      await BlogCommentModel.findById(commentId).select("user blog");

    if (!comment) return { success: false, message: "Comment not found" };

    //  Find the blog
    const blog = await BlogModel.findById(blogId).select("educator");
    if (!blog) return { success: false, message: "Blog not found" };

    const isCommentOwner = comment.user.toString() === currentUser.id;
    const isBlogAuthor = blog.educator.toString() === currentUser.id;

    //  Permission check
    if (!isCommentOwner && !isBlogAuthor)
      return {
        success: false,
        message: "You are not allowed to delete this comment",
      };

    //  Delete comment document
    await BlogCommentModel.findByIdAndDelete(commentId);

    //  Remove comment ID from blog.comments array
    await BlogModel.findByIdAndUpdate(blogId, {
      $pull: { comments: commentId },
    });

    //  Revalidate page
    revalidatePath(`/blogs/${blogId}`);

    return { success: true, message: "Comment deleted successfully." };
  } catch (error) {
    console.error("deleteBlogComment ERROR:", error);
    return { success: false, message: "Failed to delete comment." };
  }
};
