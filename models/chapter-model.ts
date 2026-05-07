import { Chapter } from "@/types/chapter";
import { Schema, model, models } from "mongoose";

const chapterSchema = new Schema<Chapter>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },

    educator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studySeries: {
      type: Schema.Types.ObjectId,
      ref: "StudySeries",
      required: true,
    },
    lessonIds: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],

    order: { type: Number, required: true },
    access: { type: Boolean, required: true, default: false },
    isPublished: { type: Boolean, required: true, default: false },
  },

  {
    timestamps: true,
  },
);

export const ChapterModel =
  models.Chapter || model<Chapter>("Chapter", chapterSchema);
