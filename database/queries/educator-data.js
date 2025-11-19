import { enrichItemsData } from "@/lib/enrich-item-data";
import { getCurrentUser } from "@/lib/session";
import { replaceMongoIdInArray } from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { CategoryModel } from "@/models/category-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { StudySeriesModel } from "@/models/StudySeries-model";

import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";

/**
 * Get all educators with enriched data (books + series)
 * @param {Object} options
 * @param {String} [options.search=""] - Search keyword for educator (name / username)
 * @param {"rating" | "enroll" | "followers"} [options.sort="rating"] - Sort educators by chosen metric
 * @param {Number} [options.limit=0] - Limit number of educators returned (0 = no limit)
 * @returns {Array} Enriched educator list
 */

export const getAllEducators = async ({
  search = "",
  sort = "rating",
  limit = 0,
}) => {
  try {
    await dbConnect();

    const educators = await UserModel.find({
      role: "educator",
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ],
    })
      .select("firstName lastName userName name image followers")
      .lean();

    const enriched = await Promise.all(
      educators.map(async (edu) => {
        const educatorId = edu._id;

        const [books, series, followers] = await Promise.all([
          BookModel.find({ educator: educatorId, isPublished: true }).lean(),
          StudySeriesModel.find({
            educator: educatorId,
            isPublished: true,
          }).lean(),
          // Followers count
          UserModel.countDocuments({
            _id: { $in: edu?.followers },
          }),
        ]);

        const enrichedBooks = await enrichItemsData(books, "Book");
        const enrichedSeries = await enrichItemsData(series, "StudySeries");

        const totalEnrolls =
          enrichedBooks.reduce((t, b) => t + b.totalEnrollments, 0) +
          enrichedSeries.reduce((t, s) => t + s.totalEnrollments, 0);

        const all = [...enrichedBooks, ...enrichedSeries];
        const ratedItems = all.filter((i) => i.averageRating > 0);

        const avgRating = ratedItems.length
          ? (
              ratedItems.reduce((s, i) => s + i.averageRating, 0) /
              ratedItems.length
            ).toFixed(1)
          : 0;

        return {
          id: edu._id.toString(),
          name:
            edu?.firstName && edu?.lastName
              ? `${edu.firstName} ${edu.lastName}`
              : edu?.name,
          userName: edu?.userName,
          image: edu.image,

          totalBooks: enrichedBooks.length,
          totalSeries: enrichedSeries.length,
          totalEnrolls,
          totalRated: ratedItems.length || 0,
          avgRating: Number(avgRating),
          totalFollowers: followers ?? 0,
        };
      })
    );

    // Sorting
    if (sort === "rating") enriched.sort((a, b) => b.avgRating - a.avgRating);
    if (sort === "enroll")
      enriched.sort((a, b) => b.totalEnrolls - a.totalEnrolls);
    if (sort === "followers")
      enriched.sort((a, b) => b.totalFollowers - a.totalFollowers);

    //  LIMIT APPLY
    return limit ? enriched.slice(0, limit) : enriched;
  } catch (error) {
    console.error("Educators load error:", error);
    return [];
  }
};

/**
  Get detailed educator info by userName
  * @param {String} userName -
  * @returns {Object} The enriched item with computed properties
 */

export const getEducatorInfoByUserName = async (userName) => {
  try {
    await dbConnect();

    //  Find educator
    const educator = await UserModel.findOne({ userName })
      .select("-password -email ")
      .lean();

    if (!educator) return null;

    //  Books + Series IDs and current logdin  user
    const [books, series, currentUser] = await Promise.all([
      BookModel.find({ educator: educator._id, isPublished: true })
        .select("_id")
        .lean(),
      StudySeriesModel.find({ educator: educator._id, isPublished: true })
        .select("_id")
        .lean(),
      getCurrentUser(),
    ]);

    const allIds = [...books.map((b) => b._id), ...series.map((s) => s._id)];

    // Enrollments , Rating  summary and Follower List
    const [enrollAgg, ratingAgg, followerAgg] = await Promise.all([
      // Enrollments count
      EnrollmentModel.aggregate([
        {
          $match: {
            content: { $in: allIds },
            status: { $in: ["paid", "free"] },
          },
        },
        {
          $group: {
            _id: null,
            totalEnroll: { $sum: 1 },
          },
        },
      ]),

      // Ratings count
      TestimonialModel.aggregate([
        {
          $match: {
            content: { $in: allIds },
          },
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalRating: { $sum: 1 },
          },
        },
      ]),

      // Followers count
      UserModel.countDocuments({
        _id: { $in: educator?.followers },
      }),
    ]);

    //counting totla numbers-

    const totalEnrollments = enrollAgg?.[0]?.totalEnroll ?? 0;

    const averageRating = ratingAgg?.[0]?.avgRating
      ? Number(ratingAgg[0].avgRating.toFixed(1))
      : 0;
    const ratingCount = ratingAgg?.[0]?.totalRating ?? 0;

    const totalFollowers = followerAgg ?? 0;
    const isFollowing = currentUser
      ? educator.followers?.some((id) => id.toString() === currentUser.id)
      : false;
    const isOwner = currentUser && educator._id.toString() === currentUser.id;

    return {
      ...educator,
      totalBooks: books.length,
      totalSeries: series.length,
      totalEnrollments,
      averageRating,
      ratingCount,
      totalFollowers,
      isFollowing,
      isOwner,
    };
  } catch (error) {
    console.error("Educator info error:", error);
    return null;
  }
};

/**
 *  Get educator items (books or series) by educatorId
 *  @param {ObjectId} educatorId
 *  @param {String} type -"Book" | "StudySeries"
 *  @param {Number} limit -"haw many items you want with sortBy averageRating"
 */
export const getEducatorProfileItems = async (
  educatorId,
  type,
  limit = null
) => {
  try {
    await dbConnect();
    const itemModel = type === "StudySeries" ? StudySeriesModel : BookModel;

    const items = await itemModel
      .find({
        educator: educatorId,
        isPublished: true,
      })
      .select(" title price thumbnail  createdAt")
      .sort({ createdAt: -1 })
      .populate({
        path: "category",
        model: CategoryModel,
        select: "label group subject part",
      })
      .populate("educator", "firstName lastName image userName name followers")
      .lean();

    if (!items) return;

    let enrichedItems = await enrichItemsData(items, type);

    if (limit) {
      enrichedItems = enrichedItems
        ?.sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, limit);
    }

    return replaceMongoIdInArray(enrichedItems);
  } catch (error) {
    console.error(`Educator ${type} fetch error:`, error);
    return null;
  }
};
