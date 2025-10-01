"use server";

import { getCurrentUser } from "@/lib/session";
import { dbConnect } from "@/service/mongo";

import { getACategory } from "@/database/queries/categories-data";
import { slugify } from "@/lib/formetData";
import { BookModel } from "@/models/book-model";
import mongoose from "mongoose";

export const validateCategory = async ({ label, group, subject, part }) => {
  try {
    const category = await getACategory({ label, group, subject, part });

    if (!category) throw new Error("Category not found");

    return category.id;
  } catch (error) {
    throw new Error(error?.message || "Category Not Found!");
  }
};

export const AddaNewBook = async ({
  title,
  description,
  price,
  outcomes,
  tags,
  thumbnailUrl,
  fileUrl,
  categoryId,
  isPublished,
}) => {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    if (!user?.id || user?.role !== "educator") throw new Error("Unauthorized");

    const slug = slugify(title);

    const newBook = await BookModel.create({
      title,
      slug,
      description,
      price,
      outcomes,
      tags,
      thumbnail: thumbnailUrl,
      fileUrl,
      category: new mongoose.Types.ObjectId(categoryId),
      educator: new mongoose.Types.ObjectId(user.id),
      isPublished,
    });
    if (!newBook) {
      throw new Error("New Book added failed!");
    }
    return {
      success: true,
      book: JSON.parse(JSON.stringify(newBook)),
    };
  } catch (err) {
    throw new Error(`Could not added new Book: ${err?.message}`);
  }
};
