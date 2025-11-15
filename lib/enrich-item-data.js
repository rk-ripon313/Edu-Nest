import { EnrollmentModel } from "@/models/enrollment-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import { getCurrentUser } from "./session";

/**
 * Enriches an array of items (Books or Series) with enrollment and rating data.
 *
 * For each item, this function computes:
 * 1. totalEnrollments - total number of users enrolled (status: "paid" or "free")
 * 2. averageRating - average rating from testimonials
 * 3. ratingCount - number of ratings
 *
 * @param {Array<Object>} items - List of items to enrich
 * @param {String} model - "Book" or "StudySeries" (used for aggregation)
 * @returns {Array<Object>} List of enriched items with enrollment and rating info
 */

export const enrichItemsData = async (items, model) => {
  if (!items || items.length === 0) return [];

  try {
    await dbConnect();

    const ids = items.map((i) => i._id);

    const [enrollAgg, ratingAgg] = await Promise.all([
      EnrollmentModel.aggregate([
        {
          $match: {
            status: { $in: ["paid", "free"] },
            onModel: model,
            content: { $in: ids },
          },
        },
        {
          $group: {
            _id: "$content",
            enrollCount: { $sum: 1 },
          },
        },
      ]),

      TestimonialModel.aggregate([
        {
          $match: {
            content: { $in: ids },
            onModel: model,
          },
        },
        {
          $group: {
            _id: "$content",
            avgRating: { $avg: "$rating" },
            ratingCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Create Maps
    const enrollMap = new Map(
      enrollAgg.map((e) => [e._id.toString(), e.enrollCount])
    );

    const ratingMap = new Map(
      ratingAgg.map((r) => [
        r._id.toString(),
        {
          avg: r.avgRating,
          total: r.ratingCount,
        },
      ])
    );

    // Enrich and return
    return items.map((item) => {
      const id = item._id.toString();
      const enrollCount = enrollMap.get(id) || 0;
      const rating = ratingMap.get(id) || { avg: 0, total: 0 };

      return {
        ...item,
        totalEnrollments: enrollCount,
        averageRating: parseFloat(rating.avg.toFixed(1)),
        ratingCount: rating.total,
      };
    });
  } catch (error) {
    console.error("Error in enrichItemsData:", error);

    return items.map((item) => ({
      ...item,
      totalEnrollments: 0,
      averageRating: 0,
      ratingCount: 0,
    }));
  }
};

/**
 * Enriches a single item (Book or Series) with additional computed data.
 * Total enrollments,Average rating and rating count,Followers count,Flags for- isOwner isEnrolled isFollowing
 * @param {Object} item - The item object (Book or Series) to enrich
 * @param {String} model - Either "Book" or "StudySeries" (used for aggregation)
 * @returns {Object} The enriched item with computed properties
 */
export const enrichItemDatabyId = async (item, model) => {
  if (!item || !item._id || !model) return item;

  try {
    await dbConnect();

    const id = item._id;

    const [totalEnrollments, ratings, educatorFollowers] = await Promise.all([
      // Enroll count
      EnrollmentModel.countDocuments({
        status: { $in: ["paid", "free"] },
        onModel: model,
        content: id,
      }),

      // Ratings
      TestimonialModel.find({
        onModel: model,
        content: id,
      })
        .select("rating")
        .lean(),

      // Followers count
      UserModel.countDocuments({
        _id: { $in: item?.educator?.followers },
      }),
    ]);

    const ratingCount = ratings.length;
    const averageRating =
      ratingCount > 0
        ? parseFloat(
            (
              ratings.reduce((sum, r) => sum + r.rating, 0) / ratingCount
            ).toFixed(1)
          )
        : 0;

    const user = await getCurrentUser();

    let isOwner = false;
    let isEnrolled = false;
    let isFollowing = false;

    if (user?.id) {
      isOwner = item.educator?._id?.toString() === user?.id;

      //  Only check enrollment & follow if not owner
      if (!isOwner) {
        const enrollment = await EnrollmentModel.findOne({
          status: { $in: ["paid", "free"] },
          onModel: model,
          content: id,
          student: user?.id,
        });

        isEnrolled = !!enrollment;

        //  check if current user already following this educator
        isFollowing = user?.following?.some(
          (f) => f.toString() === item.educator._id.toString()
        );
      }
    }

    return {
      ...item,
      totalEnrollments,
      educatorFollowers,
      averageRating,
      ratingCount,
      isOwner,
      isEnrolled,
      isFollowing,
    };
  } catch (error) {
    console.error("Error enriching single item:", error);

    return {
      ...item,
      totalEnrollments: 0,
      educatorFollowers: 0,
      averageRating: 0,
      ratingCount: 0,
      isOwner: false,
      isEnrolled: false,
      isFollowing: false,
    };
  }
};
