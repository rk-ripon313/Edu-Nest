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
import { redirect } from "next/navigation";

//finding all enrollment for logged in user
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

//Finding existing Enrollment
export const getHasEnrollment = async (onModel, itemId) => {
  await dbConnect();
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const hasEnrollment = await EnrollmentModel.findOne({
    student: new mongoose.Types.ObjectId(user?.id),
    onModel,
    content: new mongoose.Types.ObjectId(itemId),
    status: { $in: ["paid", "free"] },
  }).lean();
  return hasEnrollment ? replaceMongoIdInObject(hasEnrollment) : null;
};

//create a new Enrollment
export const createNewEnrollment = async (enrollmentData) => {
  await dbConnect();
  try {
    const data = {
      ...enrollmentData,
      student: new mongoose.Types.ObjectId(enrollmentData.student),
      content: new mongoose.Types.ObjectId(enrollmentData.content),
    };
    const newEnrollment = await EnrollmentModel.create(data);
    return replaceMongoIdInObject(newEnrollment);
  } catch (error) {
    console.error("Enrollment creation failed:", error);
    return null;
  }
};
