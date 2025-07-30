import { applySort } from "@/lib/applySort";
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

//here is all books with all filter maping sort logic
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

  try {
    dbConnect();
    const books = await BookModel.find(filter)
      .select("title category thumbnail educator price createdAt updatedAt")
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
    const filteredBooks = books.filter((book) => book.category);

    // Get total count for pagination (without skip & limit)
    const totalCount = await BookModel.countDocuments(filter).exec();

    // Add rating + enroll info
    const enrichedBooks = await enrichItemsData(filteredBooks, "Book");

    //  Sorting
    const sortedBooks = sort ? applySort(enrichedBooks, sort) : enrichedBooks;

    return {
      allBooks: replaceMongoIdInArray(sortedBooks),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching Books:", error);
    return {
      allBooks: [],
      totalCount: 0,
    };
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
        select: "firstName lastName image userName",
      })
      .lean();

    if (!book?.isPublished) return {};

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
        { $match: { status: "paid", onModel: "Book" } },
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
