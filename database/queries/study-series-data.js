import { enrichItemsData } from "@/lib/enrich-item-data";
import { replaceMongoIdInArray } from "@/lib/transformId";
import { CategoryModel } from "@/models/category-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { StudySeriesModel } from "@/models/StudySeries -model";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";

export const getStudySeries = async ({
  search,
  sort,
  label,
  group,
  subject,
  part,
  minPrice,
  maxPrice,
  page = 1,
  itemsPerPage = 9,
}) => {
  const filter = {
    isPublished: true,
  };

  // Search by title
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ slug: { $regex: regex } }, { tags: { $regex: regex } }];
  }

  // Filter by price range
  const parsedMin = Number(minPrice);
  const parsedMax = Number(maxPrice);

  if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
    filter.price = {
      $gte: parsedMin,
      $lte: parsedMax,
    };
  }

  // Category-based filter using populate matching
  const categoryFilter = {};
  if (label) categoryFilter.label = label;
  if (group) categoryFilter.group = group;
  if (subject) categoryFilter.subject = subject;
  if (part) categoryFilter.part = part;

  const skip = (page - 1) * itemsPerPage;

  const series = await StudySeriesModel.find(filter)
    .select(
      "title category thumbnail educator price chapters createdAt updatedAt"
    )
    .populate({
      path: "category",
      model: CategoryModel,
      match: categoryFilter,
      select: "label group subject part",
    })
    .populate({
      path: "educator",
      model: UserModel,
      select: "firstName lastName",
    })
    .skip(skip)
    .limit(itemsPerPage)
    .lean();

  // Remove books where `category` was filtered out by `match`
  const filteredSeries = series.filter((book) => book.category);

  // Get total count for pagination (without skip & limit)
  const totalCount = await StudySeriesModel.countDocuments(filter).exec();

  // Add rating + enroll info
  const enrichedSeries = await enrichItemsData(filteredSeries, "StudySeries");

  //  Sorting
  const sortedSeries = sort ? applySort(enrichedSeries, sort) : enrichedSeries;

  return {
    allBooks: replaceMongoIdInArray(sortedSeries),
    totalCount,
  };
};

// type: "enroll" | "rating",
export const getStudySeriesByType = async (type, limit = 12) => {
  let selectedSeries = [];

  if (type === "enroll") {
    selectedSeries = await EnrollmentModel.aggregate([
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
  } else {
    selectedSeries = await TestimonialModel.aggregate([
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
  }

  const seriesIds = selectedSeries.map((b) => b._id);

  const series = await StudySeriesModel.find({
    _id: { $in: seriesIds },
    isPublished: true,
  })
    .select(
      "title category thumbnail educator price chapters createdAt updatedAt"
    )
    .populate({
      path: "category",
      model: CategoryModel,
      select: "label group subject part",
    })
    .populate({
      path: "educator",
      model: UserModel,
      select: "firstName lastName",
    })
    .lean();

  const enriched = await enrichItemsData(series, "StudySeries");
  return replaceMongoIdInArray(enriched);
};
