"use server";

import { slugify } from "@/lib/formetData";
import { getCurrentUser } from "@/lib/session";
import { BlogModel } from "@/models/blog-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

export const createBlog = async ({
  title,
  shortDescription,
  content,
  status,
  tags,
  imagesUrl,
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
      images: Array.isArray(imagesUrl) ? imagesUrl : [imagesUrl],
      status,
      tags,
    });

    if (!newBlog) {
      return { success: false, message: "New Blog added failed!" };
    }
    return { success: true, message: "Blog added successfully" };
  } catch (error) {
    return {
      success: false,
      message: `Could not added new Blog: ${error?.message}`,
    };
  }
};
