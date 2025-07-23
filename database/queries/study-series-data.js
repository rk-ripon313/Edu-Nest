import { enrichItemsData } from "@/lib/enrich-item-data";
import { replaceMongoIdInArray } from "@/lib/transformId";
import { CategoryModel } from "@/models/category-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { StudySeriesModel } from "@/models/StudySeries -model";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";

export const getPopularStudySeries = async (limit = 12) => {
  const PopularSeries = await EnrollmentModel.aggregate([
    { $match: { status: "paid", onModel: "StudySeries" } },
    {
      $group: {
        _id: "$content",
        enrollCount: { $sum: 1 },
      },
    },
    { $sort: { enrollCount: -1 } },
    { $limit: limit },
  ]);

  const seriesIds = PopularSeries.map((b) => b._id);

  const series = await StudySeriesModel.find({
    _id: { $in: seriesIds },
    isPublished: true,
  })
    .select("title category thumbnail educator price chapters")
    .populate({
      path: "category",
      model: CategoryModel,
      select: "label group subject part",
    })
    .populate({
      path: "educator",
      model: UserModel,
      select: "firstName lastName ",
    })
    .lean();

  //  Other Importents data added by enrichBooks fun.
  const enrichedBooks = await enrichItemsData(series, "StudySeries");
  return replaceMongoIdInArray(enrichedBooks);
};

export const getTopRatedStudySeries = async (limit = 12) => {
  const topRatedSeries = await TestimonialModel.aggregate([
    { $match: { onModel: "StudySeries" } },
    {
      $group: {
        _id: "$content",
        avgRating: { $avg: "$rating" },
      },
    },
    { $sort: { avgRating: -1 } },
    { $limit: limit },
  ]);

  const seriesIds = topRatedSeries.map((b) => b._id);

  const series = await StudySeriesModel.find({
    _id: { $in: seriesIds },
    isPublished: true,
  })
    .select("title category thumbnail educator price chapters")
    .populate({
      path: "category",
      model: CategoryModel,
      select: "label group subject part",
    })
    .populate({
      path: "educator",
      model: UserModel,
      select: "firstName lastName ",
    })
    .lean();

  //  Other Importents data added by enrichBooks fun.
  const enrichedBooks = await enrichItemsData(series, "StudySeries");
  return replaceMongoIdInArray(enrichedBooks);
};
