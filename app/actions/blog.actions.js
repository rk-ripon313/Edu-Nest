"use server";

import { slugify } from "@/lib/formetData";
import { getCurrentUser } from "@/lib/session";
import { BlogModel } from "@/models/blog-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

// Create a new Blog...
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

//update a blog By BlogID..
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

//Delete Blog

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
