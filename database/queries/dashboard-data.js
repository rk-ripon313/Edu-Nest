import { enrichItemsData } from "@/lib/enrich-item-data";
import { replaceMongoIdInObject } from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { CategoryModel } from "@/models/category-model";
import { ChapterModel } from "@/models/chapter-model";
import { LessonModel } from "@/models/lesson-model";
import { StudySeriesModel } from "@/models/StudySeries-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { getEnrollments } from "./enrollments-data";
import { getTestimonials } from "./testimonials-data";

//educator items list fn..
export const getEducatorItems = async (onModel, userId, enrich = false) => {
  try {
    await dbConnect();
    const model = onModel === "Book" ? BookModel : StudySeriesModel;

    const items = await model
      .find({
        educator: new mongoose.Types.ObjectId(userId),
      })
      .select("title category chapters isPublished  price createdAt updatedAt")
      .populate({
        path: "category",
        model: CategoryModel,
        select: "label group subject part",
      })
      .sort({ createdAt: -1 })
      .lean();

    if (enrich) {
      //enrich enrollment and reviews data
      return await enrichItemsData(items, onModel);
    }
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

//educator item details fn..
export const getEducatorItemInfobyId = async (
  onModel,
  itemId,
  userId,
  enrich = false
) => {
  try {
    await dbConnect();

    let item = {};

    if (onModel === "StudySeries") {
      item = await StudySeriesModel.findById(itemId)
        .populate({
          path: "category",
          model: CategoryModel,
          select: "label group subject part",
        })
        .populate({
          path: "chapters",
          model: ChapterModel,
          options: { sort: { order: 1 } },
          populate: {
            path: "lessonIds",
            model: LessonModel,
            options: { sort: { order: 1 } },
          },
        })
        .lean();
    } else {
      item = await BookModel.findById(itemId)
        .populate({
          path: "category",
          model: CategoryModel,
          select: "label group subject part",
        })
        .lean();
    }

    if (!item || item?.educator?.toString() !== userId) {
      return null;
    }

    if (enrich) {
      // fetch enrollments & reviews
      const enrollments = await getEnrollments(onModel, itemId);
      const reviews = await getTestimonials(onModel, itemId);

      // student-wise data marge
      const studentData = enrollments.map((enroll) => {
        const review = reviews.find(
          (rev) => rev.student._id.toString() === enroll.student._id.toString()
        );

        return {
          student: enroll.student,
          enrollment: {
            status: enroll.status,
            price: enroll.price,
            createdAt: enroll.createdAt,
          },
          review: review
            ? {
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
              }
            : null,
        };
      });

      item.students = studentData;
    }

    return replaceMongoIdInObject(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};
