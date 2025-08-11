import { replaceMongoIdInArray } from "@/lib/transformId";
import { CategoryModel } from "@/models/category-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { UserModel } from "@/models/user-model";
import mongoose from "mongoose";

export const getEnrolledItems = async (
  userId,
  model,
  { search = "", sort = "latest" } = {}
) => {
  if (model === "Book") {
    await import("@/models/book-model");
  } else if (model === "StudySeries") {
    await import("@/models/StudySeries-model");
  }

  try {
    const searchRegex = search ? new RegExp(search, "i") : null;

    const findQuery = {
      student: new mongoose.Types.ObjectId(userId),
      onModel: model,
      status: "paid",
    };

    const enrolledItems = await EnrollmentModel.find(findQuery)
      .sort(
        sort === "latest"
          ? { createdAt: -1 }
          : sort === "oldest"
          ? { createdAt: 1 }
          : {}
      )
      .populate({
        path: "content",
        match: {
          isPublished: true,
          ...(searchRegex && { title: searchRegex }),
        },
        select: "title category thumbnail price isPublished educator chapters",
        populate: [
          {
            path: "educator",
            model: UserModel,
            select: "firstName lastName name userName",
          },
          {
            path: "category",
            model: CategoryModel,
            select: "label group subject part",
          },
        ],
      })
      .lean();

    let items = enrolledItems.map((e) => e.content).filter(Boolean);

    // Sort by price if needed
    if (sort === "price-low") {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      items.sort((a, b) => b.price - a.price);
    }

    return replaceMongoIdInArray(items);
  } catch (error) {
    console.error(`Error in getEnrolledItems for model "${model}":`, error);
    return [];
  }
};
