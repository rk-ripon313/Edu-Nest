import { EnrollmentModel } from "@/models/enrollment-model";
import { TestimonialModel } from "@/models/testimonial-model";

export const enrichItemsData = async (items, model) => {
  const ids = items.map((i) => i._id);

  // Enrollment Count
  const enrollAgg = await EnrollmentModel.aggregate([
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
  ]);

  // Rating Data (avg + total)
  const ratingAgg = await TestimonialModel.aggregate([
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
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  // Create Map
  const enrollMap = new Map(
    enrollAgg.map((e) => [e._id.toString(), e.enrollCount])
  );
  // Map {
  //   "64aa001e9705487c69b2be03" => 4,
  //   "64bb002e9705487c69b2be04" => 2,
  // }

  const ratingMap = new Map(
    ratingAgg.map((r) => [
      r._id.toString(),
      {
        avg: r.avgRating,
        total: r.totalRatings,
      },
    ])
  );
  // Map {
  //   "64aa001e9705487c69b2be03" => { avg: 4.7, total: 6 },
  //   "64bb002e9705487c69b2be04" => { avg: 5.0, total: 3 },
  // }

  //  enriched items  return
  return items.map((item) => {
    const id = item._id.toString();

    const enrollCount = enrollMap.get(id) || 0;
    const rating = ratingMap.get(id) || { avg: 0, total: 0 };

    return {
      ...item,
      totalEnrollments: enrollCount,
      averageRating: parseFloat(rating.avg.toFixed(1)),
      totalRatings: rating.total,
    };
  });
};
