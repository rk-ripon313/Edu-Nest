import { applySort } from "@/lib/applySort";
import { enrichItemsData } from "@/lib/enrich-item-data";
import { replaceMongoIdInArray } from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { CategoryModel } from "@/models/category-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";

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
  if (minPrice !== undefined && maxPrice !== undefined) {
    filter.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };
  }

  // Category-based filter using populate matching
  const categoryFilter = {};
  if (label) categoryFilter.label = label;
  if (group) categoryFilter.group = group;
  if (subject) categoryFilter.subject = subject;
  if (part) categoryFilter.part = part;

  const skip = (page - 1) * itemsPerPage;

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
};

// type: "enroll" | "rating",
export const getBooksByType = async (type, limit = 12) => {
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
};
