import { getMongoSortStage } from "@/lib/applySort";
import { enrichItemDatabyId, enrichItemsData } from "@/lib/enrich-item-data";
import { getCurrentUser } from "@/lib/session";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/transformId";
import { CategoryModel } from "@/models/category-model";
import { ChapterModel } from "@/models/chapter-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { LessonModel } from "@/models/lesson-model";
import { ReportModel } from "@/models/repport-model";
import { StudySeriesModel } from "@/models/StudySeries-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";
import { WatchModel } from "@/models/watch-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { createAReport } from "./reports-data";

// Uses MongoDB $facet for single query fetching paginated data + total count --- All series
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
  await dbConnect();

  const filter = { isPublished: true };

  // Search filter
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ slug: { $regex: regex } }, { tags: { $regex: regex } }];
  }

  // Price filter
  const parsedMin = Number(minPrice);
  const parsedMax = Number(maxPrice);
  if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
    filter.price = { $gte: parsedMin, $lte: parsedMax };
  }

  const skip = (page - 1) * itemsPerPage;
  const sortStage = getMongoSortStage(sort);

  try {
    const pipeline = [
      { $match: filter },
      // Category populate
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      // Category filters
      {
        $match: {
          ...(label && { "category.label": label }),
          ...(group && { "category.group": group }),
          ...(subject && { "category.subject": subject }),
          ...(part && { "category.part": part }),
        },
      },
      // Educator populate
      {
        $lookup: {
          from: "users",
          localField: "educator",
          foreignField: "_id",
          as: "educator",
        },
      },
      { $unwind: "$educator" },
      // Facet for paginated data + total count

      {
        $facet: {
          data: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: itemsPerPage },
            {
              $project: {
                title: 1,
                price: 1,
                thumbnail: 1,
                createdAt: 1,
                "category.label": 1,
                "category.group": 1,
                "category.subject": 1,
                "category.part": 1,
                "educator.firstName": 1,
                "educator.lastName": 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await StudySeriesModel.aggregate(pipeline);
    //console.log({ result });

    const series = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    // Enrich with rating and enrollment

    const enrichedSeries = await enrichItemsData(series, "StudySeries");
    return {
      allStudySeries: replaceMongoIdInArray(enrichedSeries),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching study series:", error);
    return {
      allStudySeries: [],
      totalCount: 0,
    };
  }
};

//here is a series dedails with all  populate data...
export const getStudySeriesById = async (id) => {
  if (!id) return;

  try {
    await dbConnect();

    const series = await StudySeriesModel.findById(id)
      .populate({
        path: "category",
        model: CategoryModel,
        select: "label group subject part",
      })
      .populate({
        path: "educator",
        model: UserModel,
        select: "firstName lastName image userName",
      })
      .populate({
        path: "chapters",
        model: ChapterModel,
        select: "title  order lessonIds",
        match: { isPublished: true },
        options: { sort: { order: 1 } },
        populate: {
          path: "lessonIds",
          model: LessonModel,
          select: "title  duration isPreview videoUrl  order",
          match: { isPublished: true },
          options: { sort: { order: 1 } },
        },
      })
      .lean();

    if (!series || !series?.isPublished) return;

    const enrichedSeries = await enrichItemDatabyId(series, "StudySeries");

    return replaceMongoIdInObject(enrichedSeries);
  } catch (error) {
    console.error("Error fetching Series By Id:", error);
  }
};

//get related series --

export const getRelatedStudySeries = async (tags, currentId, limit = 12) => {
  try {
    await dbConnect();

    const related = await StudySeriesModel.find({
      _id: { $ne: new mongoose.Types.ObjectId(currentId) }, // exclude current seies
      tags: { $in: tags },
      isPublished: true,
    })
      .select(
        "title category thumbnail educator price createdAt updatedAt chapters"
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
      .limit(limit)
      .lean();

    //  Other Importents data added by enrichBooks fun.
    const enrichedSeries = await enrichItemsData(related, "StudySeries");
    return replaceMongoIdInArray(enrichedSeries);
  } catch (error) {
    console.error("Error fetching related Series:", error);
    return [];
  }
};

// type: "enroll" | "rating",
export const getStudySeriesByType = async (type, limit = 12) => {
  try {
    await dbConnect();
    let selectedSeries = [];

    if (type === "enroll") {
      selectedSeries = await EnrollmentModel.aggregate([
        {
          $match: { status: { $in: ["paid", "free"] }, onModel: "StudySeries" },
        },
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
  } catch (error) {
    console.error("getStudySeriesByType error:", error);
    return [];
  }
};

//study series data with progress
export const getStudySeriesForPlay = async (id) => {
  if (!id) return null;

  try {
    await dbConnect();
    const user = await getCurrentUser();
    if (!user) return null;

    const series = await StudySeriesModel.findById(id)
      .populate({
        path: "chapters",
        model: ChapterModel,
        select: "title order lessonIds",
        match: { isPublished: true },
        options: { sort: { order: 1 } },
        populate: {
          path: "lessonIds",
          model: LessonModel,
          match: { isPublished: true },
          options: { sort: { order: 1 } },
        },
      })
      .lean();

    if (!series || !series?.isPublished) return null;
    const studySeries = new mongoose.Types.ObjectId(id);
    const student = new mongoose.Types.ObjectId(user.id);

    // report..
    let report = await ReportModel.findOne({ studySeries, student })
      .populate({
        path: "currentWatch",
        model: WatchModel,
        populate: {
          path: "lesson",
          model: LessonModel,
          match: { isPublished: true, access: true },
        },
      })
      .lean();

    if (!report) {
      report = await createAReport({ studySeries, student });
      if (!report) throw new Error("Failed to create report for student");
    }
    // console.log({ report });

    const completedLessons =
      report?.totalCompletedLessons?.map((l) => l.toString()) || [];
    const completedChapters =
      report?.totalCompletedChapter?.map((c) => c.toString()) || [];

    // lesson-level completed flag inject
    series.chapters = series.chapters.map((ch) => {
      const lessons = ch.lessonIds.map((ls) => ({
        ...ls,
        completed: completedLessons.includes(ls._id.toString()),
      }));

      const completedCount = lessons.filter((ls) => ls.completed).length;

      const isChapterCompleted =
        lessons.length > 0 &&
        lessons.every((ls) => completedLessons.includes(ls._id.toString()));

      return {
        ...ch,
        lessonIds: lessons,
        chapterCompleted:
          completedChapters.includes(ch._id.toString()) || isChapterCompleted,
        totalLessons: lessons.length,
        completedLessons: completedCount,
      };
    });

    // series-level total progress
    const allLessons = series.chapters.flatMap((ch) => ch.lessonIds);
    const totalCount = allLessons.length;
    const completedCount = allLessons.filter((ls) => ls.completed).length;

    //total progress
    series.totalProgress =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    //   current watch
    series.currentWatch = report?.currentWatch?.lesson
      ? report.currentWatch
      : null;

    return replaceMongoIdInObject(series);
  } catch (error) {
    console.error("Error fetching PlayPage Series:", error);
    return null;
  }
};
