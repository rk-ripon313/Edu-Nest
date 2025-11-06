import { enrichItemDatabyId, enrichItemsData } from "@/lib/enrich-item-data";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { CategoryModel } from "@/models/category-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

import { getMongoSortStage } from "@/lib/applySort";

// Uses MongoDB $facet for single query fetching paginated data + total count ---All Books
export const getAllBooks = async ({
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

    const result = await BookModel.aggregate(pipeline);
    //console.log({ result });

    const books = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    // Enrich with rating and enrollment
    const enrichedBooks = await enrichItemsData(books, "Book");

    return {
      allBooks: replaceMongoIdInArray(enrichedBooks),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { allBooks: [], totalCount: 0 };
  }
};

//here is a books dedails with all  populate data...
export const getBookById = async (id) => {
  if (!id) return;

  try {
    await dbConnect();

    const book = await BookModel.findById(id)
      .populate({
        path: "category",
        model: CategoryModel,
        select: "label group subject part",
      })
      .populate({
        path: "educator",
        model: UserModel,
        select: "firstName lastName image userName name",
      })
      .lean();

    if (!book || !book?.isPublished) return;

    const enrichedBook = await enrichItemDatabyId(book, "Book");

    return replaceMongoIdInObject(enrichedBook);
  } catch (error) {
    console.error("Error fetching Book By Id:", error);
  }
};

//get related books --

export const getRelatedBooks = async (tags, currentId, limit = 12) => {
  try {
    await dbConnect();

    const related = await BookModel.find({
      _id: { $ne: new mongoose.Types.ObjectId(currentId) }, // exclude current book
      tags: { $in: tags },
      isPublished: true,
    })
      .select("title category thumbnail educator price createdAt updatedAt")
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
    const enrichedBooks = await enrichItemsData(related, "Book");
    return replaceMongoIdInArray(enrichedBooks);
  } catch (error) {
    console.error("Error fetching related books:", error);
    return [];
  }
};

//for populer top-rated books type: "enroll" | "rating",
export const getBooksByType = async (type, limit = 12) => {
  try {
    dbConnect();
    let selectedBooks = [];

    if (type === "enroll") {
      selectedBooks = await EnrollmentModel.aggregate([
        { $match: { status: { $in: ["paid", "free"] }, onModel: "Book" } },
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
      selectedBooks = await TestimonialModel.aggregate([
        { $match: { onModel: "Book" } },
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

    const bookIds = selectedBooks.map((b) => b._id);

    const books = await BookModel.find({
      _id: { $in: bookIds },
      isPublished: true,
    })
      .select("title category thumbnail educator price createdAt updatedAt")
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
    const enrichedBooks = await enrichItemsData(books, "Book");
    return replaceMongoIdInArray(enrichedBooks);
  } catch (error) {
    console.error("getStudySeriesByType error:", error);
    return [];
  }
};
