import { enrichItemsData } from "@/lib/enrich-item-data";
import { getCurrentUser } from "@/lib/session";
import { replaceMongoIdInObject } from "@/lib/transformId";
import { BlogModel } from "@/models/blog-model";
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

/**
 * Get Educator Dashboard Overview Data
 *
 * @returns {Object} Dashboard data including stats, recent enrollments & reviews
 *
 * Features:
 * - Only available for logged-in educator users
 * - Counts total revenue (paid enrollments)
 * - Calculates total & type-wise enrollments (Book / StudySeries)
 * - Calculates total rating & average rating
 * - Counts published books & series
 * - Returns recent 5 enrollments & testimonials
 */
export const getEducatorDashboardData = async () => {
  await dbConnect();

  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "educator") return;

    const educator = new mongoose.Types.ObjectId(user.id);

    //  Get educator’s books and series
    const [books, series, blogs] = await Promise.all([
      BookModel.find({ educator }).select("_id isPublished").lean(),
      StudySeriesModel.find({ educator }).select("_id isPublished").lean(),
      BlogModel.find({ educator }).select("_id status").lean(),
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
    const totalPublishedBlogs =
      blogs?.filter((b) => b.status === "published").length || 0;

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
        totalPublishedBlogs,
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

/**
 * Get educator items list (Books or Study Series)
 *
 * @param {"Book"|"StudySeries"} onModel - Which model to fetch
 * @param {string} userId - Educator ID
 * @param {boolean} [enrich=false] - Whether to enrich items with enrollments & reviews
 * @returns {Array} Items list with category populated and optional enriched data
 */

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

/**
 * Get single educator item details (Book / StudySeries)
 *
 * @param {"Book"|"StudySeries"} onModel - Model type
 * @param {string} itemId - Item ID
 * @param {string} userId - Educator ID (ownership validation)
 * @param {boolean} [enrich=false] - Whether to attach student enrollment + review details
 * @returns {Object|null} Item details with optional enriched student data
 */
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

/**
 * Get educator dashboard blogs
 * @param {Object} options - Filter & sorting options
 * @param {string} [options.search=""] - Search by title, slug or tags
 * @param {("latest"|"oldest"|"popular"|"trending")} [options.sort="latest"] - Sorting type
 * @returns {Array} Blogs list with educator populated + likes/comments count + trending flag + likers details
 */
export const getDashboardBlogs = async ({ search = "", sort = "latest" }) => {
  try {
    await dbConnect();
    const user = await getCurrentUser();

    if (!user?.id) return [];

    const currentUserId = user.id;

    // Trending date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Match condition
    const matchStage = {
      educator: new mongoose.Types.ObjectId(currentUserId),
    };

    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Sort condition
    let sortStage = { createdAt: -1 }; // default: latest

    if (sort === "oldest") {
      sortStage = { createdAt: 1 };
    } else if (sort === "popular") {
      sortStage = { likesCount: -1, commentsCount: -1 };
    } else if (sort === "trending") {
      sortStage = { isTrending: -1, likesCount: -1, commentsCount: -1 };
    }

    const blogs = await BlogModel.aggregate([
      { $match: matchStage },

      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          isTrending: {
            $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0],
          },
          isLiked: {
            $in: [new mongoose.Types.ObjectId(currentUserId), "$likes"],
          },
          isOwnBlog: true,
        },
      },

      { $sort: sortStage },

      // Populate educator
      {
        $lookup: {
          from: "users",
          localField: "educator",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                name: 1,
                userName: 1,
                image: 1,
              },
            },
          ],
          as: "educator",
        },
      },
      { $unwind: "$educator" },

      // Likers info
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                userName: 1,
                image: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
          as: "likersDetails",
        },
      },
    ]);
    return blogs;
  } catch (error) {
    console.error("getDashboardBlogs ERROR", error);
    return [];
  }
};
