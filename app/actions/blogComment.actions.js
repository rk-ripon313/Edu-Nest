"use server";

import { getBlogComments } from "@/database/queries/blogs-data";
import { getCurrentUser } from "@/lib/session";
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
