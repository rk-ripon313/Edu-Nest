import { enrichItemsData } from "@/lib/enrich-item-data";
import { replaceMongoIdInArray } from "@/lib/transformId";
import { BookModel } from "@/models/book-model";
import { CategoryModel } from "@/models/category-model";
import { EnrollmentModel } from "@/models/enrollment-model";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";

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
