import { Book } from "@/types/book";
import { Schema, model, models } from "mongoose";

const bookSchema = new Schema<Book>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },

    thumbnail: { type: String, required: true },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    educator: { type: Schema.Types.ObjectId, ref: "User", required: true },

    fileUrl: { type: String, required: true },

    outcomes: { type: [String], default: [] },
    tags: { type: [String], default: [] },

    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);

export const BookModel = models.Book || model<Book>("Book", bookSchema);
