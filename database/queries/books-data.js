import { enrichItemDatabyId, enrichItemsData } from "@/lib/enrich-item-data";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

import { getMongoSortStage } from "@/lib/applySort";

/**
 * Get all published books with optional filters for search, category, price range, and pagination. Each book is enriched with additional data like enrollment count, rating count, average rating, and populated category and educator details.
 * @param {Object} options - The filter and pagination options
 * @param {string} options.search - Search term to match against book slug and tags
 * @param {string} options.sort - Sort option (e.g., "newest", "oldest", "priceAsc", "priceDesc")
 * @param {string} options.label - Category label filter
 * @param {string} options.group - Category group filter
 * @param {string} options.subject - Category subject filter
 * @param {string} options.part - Category part filter
 * @param {number} options.minPrice - Minimum price filter
 * @param {number} options.maxPrice - Maximum price filter
 * @param {number} options.page - Page number for pagination (default: 1)
 * @param {number} options.itemsPerPage - Number of items per page for pagination (default: 9)
 * @returns {Promise<Object>} - An object containing the array of enriched books and the total count of matching books
 */
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

/**
 * Get a single book by ID with enriched data like enrollment count, rating count, average rating, and populated category and educator details.
 * @param {string} id - The ID of the book to retrieve
 * @returns {Promise<Object|null>} - The enriched book object or null if not found/unpublished
 */

export const getBookById = async (id) => {
  if (!id) return;

  try {
    await dbConnect();

    const book = await BookModel.findById(id)
      .populate("category", "label group subject part")
      .populate("educator", "firstName lastName image userName name followers")
      .lean();

    if (!book || !book?.isPublished) return;

    const enrichedBook = await enrichItemDatabyId(book, "Book");

    return replaceMongoIdInObject(enrichedBook);
  } catch (error) {
    console.error("Error fetching Book By Id:", error);
  }
};

/**
 * Get related books based on shared tags, excluding the current book
 * @param {Array} tags - array of tags to match
 * @param {string} currentId - ID of the current book to exclude from results
 * @param {number} limit - number of related books to return (default: 12)
 * @returns {Promise<Array>} - array of related books with enriched data like enrollment count, rating count, average rating
 */

export const getRelatedBooks = async (tags, currentId, limit = 12) => {
  try {
    await dbConnect();

    const related = await BookModel.find({
      _id: { $ne: new mongoose.Types.ObjectId(currentId) }, // exclude current book
      tags: { $in: tags },
      isPublished: true,
    })
      .select("title category thumbnail educator price createdAt updatedAt")
      .populate("category", "label group subject part")
      .populate("educator", "firstName lastName name image userName role")
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

/**
 * Get books by type: most enrolled or top-rated
 * @param {string} type - "enroll" for most enrolled books, "rating" for top-rated books
 * @param {number} limit - number of books to return (default: 12)
 * @returns {Promise<Array>} - array of books with enriched data like enrollment count, rating count, average rating
 */

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
            ratingCount: { $sum: 1 },
          },
        },
        //minimum review condition
        { $match: { ratingCount: { $gte: 3 } } },
        { $sort: { avgRating: -1, ratingCount: -1 } },
        { $limit: limit },
      ]);
    }

    const bookIds = selectedBooks.map((b) => b._id);

    // order map
    const orderMap = new Map(
      selectedBooks.map((b, index) => [b._id.toString(), index]),
    );

    const books = await BookModel.find({
      _id: { $in: bookIds },
      isPublished: true,
    })
      .select("title category thumbnail educator price createdAt updatedAt")
      .populate("category", "label group subject part")
      .populate("educator", "firstName lastName name image userName role")
      .lean();

    //  preserve order
    const sortedBooks = books.sort(
      (a, b) => orderMap.get(a._id.toString()) - orderMap.get(b._id.toString()),
    );

    //  Other Importents data added by enrichBooks fun.
    const enrichedBooks = await enrichItemsData(sortedBooks, "Book");

    return replaceMongoIdInArray(enrichedBooks);
  } catch (error) {
    console.error("getStudySeriesByType error:", error);
    return [];
  }
};
