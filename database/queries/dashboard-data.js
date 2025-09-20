import { enrichItemsData } from "@/lib/enrich-item-data";
import { replaceMongoIdInObject } from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { CategoryModel } from "@/models/category-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { getEnrollments } from "./enrollments-data";
import { getTestimonials } from "./testimonials-data";

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

export const getEducatorBookInfobyId = async (
  bookId,
  userId,
  enrich = false
) => {
  try {
    await dbConnect();

    let book = await BookModel.findById(bookId)
      .populate({
        path: "category",
        model: CategoryModel,
        select: "label group subject part",
      })
      .lean();

    if (!book || book?.educator?.toString() !== userId) {
      return null;
    }

    if (enrich) {
      // fetch enrollments & reviews
      const enrollments = await getEnrollments("Book", bookId);
      const reviews = await getTestimonials("Book", bookId);

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

      book.students = studentData;
    }

    return replaceMongoIdInObject(book);
  } catch (error) {
    console.error("Error fetching Books:", error);
    return [];
  }
};
