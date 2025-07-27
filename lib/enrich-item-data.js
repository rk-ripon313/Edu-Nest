import { EnrollmentModel } from "@/models/enrollment-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { dbConnect } from "@/service/mongo";

export const enrichItemsData = async (items, model) => {
  if (!items || items.length === 0) return [];

  try {
    await dbConnect();

    const ids = items.map((i) => i._id);

    const [enrollAgg, ratingAgg] = await Promise.all([
      EnrollmentModel.aggregate([
        {
          $match: {
            status: "paid",
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
