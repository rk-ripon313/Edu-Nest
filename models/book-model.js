import { Schema, model, models } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    thumbnail: { type: String, required: true },
    educator: { type: Schema.Types.ObjectId, ref: "User", required: true },

    level: { type: String },
    group: { type: String },
    subject: { type: String },

    fileUrl: { type: String, required: true },
    outcomes: [{ type: String }],
    tags: [{ type: String }],

    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BookModel = models.Book || model("Book", bookSchema);
