import { enrichItemsData } from "@/lib/enrich-item-data";
import { BookModel } from "@/models/book-model";
import { CategoryModel } from "@/models/category-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

export const getEducatorBooks = async (userId, enrich = false) => {
  try {
    await dbConnect();

    const books = await BookModel.find({
      educator: new mongoose.Types.ObjectId(userId),
    })
      .select("title category  isPublished  price createdAt updatedAt")
      .populate({
        path: "category",
        model: CategoryModel,
        select: "label group subject part",
      })
      .sort({ createdAt: -1 })
      .lean();

    if (enrich) {
      //enrich enrollment and reviews data
      return await enrichItemsData(books, "Book");
    }
    return books;
  } catch (error) {
    console.error("Error fetching Books:", error);
    return [];
  }
};
