import { enrichItemsData } from "@/lib/enrich-item-data";
import { getCurrentUser } from "@/lib/session";
import { replaceMongoIdInObject } from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { CategoryModel } from "@/models/category-model";
import { ChapterModel } from "@/models/chapter-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { LessonModel } from "@/models/lesson-model";
import { StudySeriesModel } from "@/models/StudySeries-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { getEnrollments } from "./enrollments-data";
import { getTestimonials } from "./testimonials-data";

// Educator Page Dashboard Data
export const getEducatorDashboardData = async () => {
  await dbConnect();

  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "educator") return;

    const educator = new mongoose.Types.ObjectId(user.id);

    //  Get educator’s books and series
    const [books, series] = await Promise.all([
      BookModel.find({ educator }).select("_id isPublished").lean(),
      StudySeriesModel.find({ educator }).select("_id isPublished").lean(),
    ]);

    const bookIds = books.map((b) => b._id);
    const seriesIds = series.map((s) => s._id);

    // All enrollments for this educator’s content
    const enrollments = await EnrollmentModel.find({
      content: { $in: [...bookIds, ...seriesIds] },
    })
      .populate("content", "title")
      .populate("student", "firstName lastName image name")
      .sort({ createdAt: -1 })
      .lean();

    //  All testimonials
    const testimonials = await TestimonialModel.find({
      content: { $in: [...bookIds, ...seriesIds] },
    })
      .populate("content", "title")
      .populate("student", "firstName lastName image name")
      .sort({ createdAt: -1 })
      .lean();

    //  Calculate stats data

    //Earnings Overview
    const totalRevenue =
      enrollments
        ?.filter((e) => e.status === "paid")
        .reduce((acc, e) => acc + (e?.price || 0), 0) || 0;

    //enrollment counts
    const totalEnrollments = enrollments?.length || 0;
    const bookEnrollmentsCount = enrollments?.length
      ? enrollments.filter((b) => b.onModel === "Book").length
      : 0;
    const seriesEnrollmentsCount = enrollments?.length
      ? enrollments.filter((b) => b.onModel === "StudySeries").length
      : 0;

    // Rating counts
    const totalRating = testimonials?.length || 0;
    const avgRating = testimonials?.length
      ? testimonials.reduce((acc, t) => acc + (t?.rating || 0), 0) /
        testimonials.length
      : 0;

    //total published item counts
    const totalPublishedBooks = books?.filter((b) => b.isPublished).length || 0;
    const totalPublishedSeries =
      series?.filter((s) => s.isPublished).length || 0;

    // Prepare recent data (limit to 5)
    const recentEnrollments = enrollments?.slice(0, 5) || [];
    const recentReviews = testimonials?.slice(0, 5) || [];

    return {
      stats: {
        totalRevenue,
        totalWithdrawn: 0,
        totalEnrollments,
        bookEnrollmentsCount,
        seriesEnrollmentsCount,
        totalRating,
        avgRating: Number(avgRating.toFixed(1)) || 0,
        totalPublishedBooks,
        totalPublishedSeries,
        totalPublishedBlogs: 12,
      },
      recentEnrollments,
      recentReviews,
    };
  } catch (error) {
    //  Safe fallback return
    return {
      stats: {
        totalRevenue: 0,
        totalWithdrawn: 0,
        totalEnrollments: 0,
        bookEnrollmentsCount: 0,
        seriesEnrollmentsCount: 0,
        totalRating: 0,
        avgRating: 0,
        totalPublishedBooks: 0,
        totalPublishedSeries: 0,
        totalPublishedBlogs: 0,
      },
      recentEnrollments: [],
      recentReviews: [],
    };
  }
};

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
