"use server";

import { getCurrentUser } from "@/lib/session";
import { dbConnect } from "@/service/mongo";

import { getACategory } from "@/database/queries/categories-data";
import { slugify } from "@/lib/formetData";
import { BookModel } from "@/models/book-model";
import mongoose from "mongoose";

// Validate that the given category (label, group, subject, part) exists in the database
export const validateCategory = async ({ label, group, subject, part }) => {
  try {
    const category = await getACategory({ label, group, subject, part });

    if (!category) {
      return { success: false, message: "Category Not Found!" };
    }
    return {
      success: true,
      categoryId: category.id,
    };
  } catch (error) {
    return { success: false, message: error?.message || "Category Not Found!" };
  }
};

// Create a new Book document in the database
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
      return { success: false, message: "New Book added failed!" };
    }
    return { success: true, message: "Book created successfully" };
  } catch (err) {
    return {
      success: false,
      message: `Could not added new Book: ${err?.message}`,
    };
  }
};

// Update (edit) an existing Books by ID
export const updateBook = async (bookId, dataToUpdate) => {
  try {
    await dbConnect();

    const { category, ...rest } = dataToUpdate;

    const updateData = {
      ...rest,
      ...(category && {
        category: new mongoose.Types.ObjectId(category),
      }),
    };

    const updatedBook = await BookModel.findByIdAndUpdate(bookId, updateData, {
      new: true,
      lean: true,
    });

    if (!updatedBook) {
      return { success: false, message: "Book not found" };
    }

    return {
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    };
  } catch (e) {
    return {
      success: false,
      message: e?.message || "Something went wrong",
    };
  }
};

// Delete a Book
export const deleteBook = async (bookId) => {
  try {
    await dbConnect();
    const res = await BookModel.findByIdAndDelete(bookId);

    if (!res) {
      return { success: false, message: "Book not found or already deleted" };
    }

    return {
      success: true,
      message: "Book deleted successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: e?.message || "Something went wrong while deleting ",
    };
  }
};
