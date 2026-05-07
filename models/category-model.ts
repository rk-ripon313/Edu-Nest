import { Category } from "@/types/category";
import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema<Category>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String },

    label: {
      type: String,
      enum: ["SSC", "HSC", "Admission", "Others"],
      required: true,
    },
    group: {
      type: String,
      enum: [
        "Science",
        "Commerce",
        "Arts",
        "General",
        "Medical",
        "Engineering",
        "Others",
      ],
      required: true,
    },
    subject: { type: String, required: true },
    part: { type: String, enum: ["1st", "2nd"] },
  },
  {
    timestamps: true,
  },
);

export const CategoryModel =
  models.Category || model<Category>("Category", CategorySchema);
