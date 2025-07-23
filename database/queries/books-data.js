import { enrichItemsData } from "@/lib/enrich-item-data";
import { replaceMongoIdInArray } from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { CategoryModel } from "@/models/category-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";

export const getPopularBooks = async (limit = 12) => {
  const popularBooks = await EnrollmentModel.aggregate([
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

  // [{
  //   _id: ObjectId("64aa001e9705487c69b2be03"), // book id
  //   enrollCount: 1
  // },]

  const bookIds = popularBooks.map((b) => b._id);

  const books = await BookModel.find({
    _id: { $in: bookIds },
    isPublished: true,
  })
    .select("title category thumbnail educator price ")
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

export const getTopRatedBooks = async (limit = 12) => {
  const topRatedBooks = await TestimonialModel.aggregate([
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

  const bookIds = topRatedBooks.map((b) => b._id);
  const books = await BookModel.find({
    _id: { $in: bookIds },
    isPublished: true,
  })
    .select("title category thumbnail educator price ")
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
