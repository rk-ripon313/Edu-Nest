"use server";

import { getBlogs } from "@/database/queries/blogs-data";
import { slugify } from "@/lib/formetData";
import { getCurrentUser } from "@/lib/session";
import { BlogModel } from "@/models/blog-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

/**
 * this action create new blog
 * @param {Object} options - blog data
 * @returns {Object} - success message or error message
 */

export const createBlog = async ({
  title,
  shortDescription,
  content,
  status,
  tags,
  images,
}) => {
  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user?.id || user?.role !== "educator")
      return { success: false, message: "Unauthorized" };

    let slug = slugify(title);

    let exists = await BlogModel.findOne({ slug }, { _id: 1 });
    if (exists) {
      const timestamp = Date.now().toString(36);
      const randomNum = Math.floor(Math.random() * 10000);
      slug = `${slug}-${timestamp}-${randomNum}`;
    }

    const newBlog = await BlogModel.create({
      educator: new mongoose.Types.ObjectId(user.id),
      title,
      slug,
      shortDescription,
      content,
      images,
      status,
      tags,
    });

    if (!newBlog) {
      return { success: false, message: "New Blog added failed!" };
    }
    revalidatePath("/blogs");
    revalidatePath("/dashboard/blogs");
    return { success: true, message: "Blog added successfully" };
  } catch (error) {
    return {
      success: false,
      message: `Could not added new Blog: ${error?.message}`,
    };
  }
};

/**
 * this action update blog by blogId
 * @param {Object} options - blogId, dataToUpdate
 * @returns {Object} - success message or error message
 */

export const updateBlog = async (blogId, dataToUpdate) => {
  try {
    await dbConnect();

    const editBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      { ...dataToUpdate },
      { new: true }
    );

    if (!editBlog) return { success: false, message: "Blog update failed!" };

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blogId}`);
    revalidatePath("/dashboard/blogs");
    revalidatePath(`/dashboard/blogs/${blogId}`);

    return { success: true, message: "Blog updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: `Could not edit  Blog: ${error?.message}`,
    };
  }
};

/**
 * this action delete blog by blogId
 * @param {Object} options - blogId
 * @returns {Object} - success message or error message
 */

export const deleteBlog = async (blogId) => {
  try {
    await dbConnect();

    const deleted = await BlogModel.findByIdAndDelete(blogId);

    if (!deleted) return { success: false, message: "Blog delete failed!" };

    revalidatePath("/blogs");
    revalidatePath("/dashboard/blogs");

    return { success: true, message: "Blog deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: `Could not delete blog: ${error?.message}`,
    };
  }
};

/**
 * this action call getBlogs quary function to fetch blogs for Load More functionality
 * @param {Object} options - filter options = currentTab, search, currentSort, page, limit
 * @returns {Array} - list of blogs
 */

export const fetchBlogsByServerAction = async ({
  currentTab,
  search,
  currentSort,
  page,
  limit,
}) => {
  // Call the server-side function
  const newBlogs = await getBlogs({
    currentTab,
    search,
    currentSort,
    page,
    limit,
  });
  return newBlogs;
};

/**
 * toggleLikeAction - Toggles the like status of a blog for the current user.
 * @param {string} blogId - The ID of the blog to like/unlike.
 * @returns {Object} {success: boolean, liked: boolean, error: string}
 */

export const toggleLikeAction = async (blogId) => {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user)
    return {
      success: false,
      message: "Authentication required to like a blog.",
    };

  const currentUserId = user.id;

  try {
    const blog = await BlogModel.findById(blogId);

    if (!blog) return { success: false, message: "Blog not found." };

    // Check if the user already liked the blog
    const alreadyLiked = blog.likes.includes(currentUserId);

    let updatedBlog;

    if (alreadyLiked) {
      // If already liked, unlike it ($pull)
      updatedBlog = await BlogModel.findByIdAndUpdate(
        blogId,
        { $pull: { likes: currentUserId } },
        { new: true }
      );
    } else {
      // If not liked, like it ($push)
      updatedBlog = await BlogModel.findByIdAndUpdate(
        blogId,
        { $push: { likes: currentUserId } },
        { new: true }
      );
    }

    revalidatePath("/blogs");
    revalidatePath(`/blogs/${blog.slug}`);

    return {
      success: true,
      liked: !alreadyLiked,
      message: alreadyLiked ? "Blog unliked." : "Blog liked.",
    };
  } catch (error) {
    console.error("Error toggling like:", error);
    return {
      success: false,
      message: "Failed to update like status.",
      liked: false,
    };
  }
};
