import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
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
    part: { type: String, enum: ["1st", "2nd"], required: false },
    thumbnail: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel =
  models.Category || model("Category", CategorySchema);
