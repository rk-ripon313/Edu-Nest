import { getCurrentUser } from "@/lib/session";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/transformId";
import { CategoryModel } from "@/models/category-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

/**
 * Returns enrollment counts for a user by model type.
 * @param {string} userId - The ID of the user whose enrollment stats are being retrieved
 * @returns {Promise<{ enrolledBooksCount: number, enrolledSeriesCount: number }>} The enrollment stats for the user
 */

export const getEnrollmentStats = async (userId) => {
  await dbConnect();

  const stats = await EnrollmentModel.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(userId),
        status: { $in: ["paid", "free"] },
      },
    },
    {
      $group: {
        _id: "$onModel",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    enrolledBooksCount: stats.find((s) => s._id === "Book")?.count || 0,
    enrolledSeriesCount: stats.find((s) => s._id === "StudySeries")?.count || 0,
  };
};

/**
 * Fetches all enrolled items for a user of a specific model type.
 * @param {string} userId - The ID of the user.
 * @param {"Book" | "StudySeries"} model - The model type to fetch.
 * @param {Object} options - Optional search and sort options.
 * @param {string} [options.search] - Search keyword for item title.
 * @param {"latest" | "oldest" | "price-low" | "price-high"} [options.sort="latest"] - Sorting method.
 * @returns {Promise<Array>} Array of enrolled items.
 */

export const getEnrolledItems = async (
  userId,
  model,
  { search = "", sort = "latest" } = {},
) => {
  if (model === "Book") {
    await import("@/models/book-model");
  } else if (model === "StudySeries") {
    await import("@/models/StudySeries-model");
  }

  try {
    await dbConnect();
    const searchRegex = search ? new RegExp(search, "i") : null;

    const findQuery = {
      student: new mongoose.Types.ObjectId(userId),
      onModel: model,
      status: { $in: ["paid", "free"] },
    };

    const enrolledItems = await EnrollmentModel.find(findQuery)
      .sort(
        sort === "latest"
          ? { createdAt: -1 }
          : sort === "oldest"
            ? { createdAt: 1 }
            : {},
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

/**
 * Checks if the current logged-in user has already enrolled in a specific item.
 * @param {"Book" | "StudySeries"} onModel - The model type.
 * @param {string} itemId - The ID of the content item.
 * @returns {Promise<Object|null>} The enrollment object if exists, otherwise null.
 */

export const getHasEnrollment = async (onModel, itemId) => {
  await dbConnect();
  const user = await getCurrentUser();
  if (!user) return null;
  const hasEnrollment = await EnrollmentModel.findOne({
    student: new mongoose.Types.ObjectId(user?.id),
    onModel,
    content: new mongoose.Types.ObjectId(itemId),
    status: { $in: ["paid", "free"] },
  }).lean();
  return hasEnrollment ? replaceMongoIdInObject(hasEnrollment) : null;
};

/**
 * Creates a new enrollment record for a user.
 * @param {Object} enrollmentData - The enrollment data object.
 * @returns {Promise<Object|null>} The created enrollment object, or null if failed.
 */

export const createNewEnrollment = async (enrollmentData) => {
  await dbConnect();
  try {
    const newEnrollment = await EnrollmentModel.create(enrollmentData);
    return replaceMongoIdInObject(newEnrollment);
  } catch (error) {
    console.error("Enrollment creation failed:", error);
    return null;
  }
};

/**
 * Fetches all enrollments for a specific content item.
 * @param {"Book" | "StudySeries"} onModel - The model type.
 * @param {string} itemId - The ID of the content item.
 * @returns {Promise<Array>} Array of enrollment objects with student populated.
 */

export const getEnrollments = async (onModel, itemId) => {
  try {
    await dbConnect();

    const enrollments = await EnrollmentModel.find({
      onModel: onModel,
      content: new mongoose.Types.ObjectId(itemId),
    })
      .populate({
        path: "student",
        model: UserModel,
        select: "image firstName lastName userName email",
      })
      .sort({ createdAt: -1 })
      .lean();
    return replaceMongoIdInArray(enrollments);
  } catch (error) {
    console.error("fetch Fail");
    return [];
  }
};
