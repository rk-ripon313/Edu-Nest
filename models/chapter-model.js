import { Schema, model, models } from "mongoose";

const chapterSchema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    slug: {
      required: true,
      type: String,
    },
    description: {
      type: String,
    },
    studySeries: {
      type: Schema.ObjectId,
      ref: "StudySeries",
      required: true,
    },
    educator: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      required: true,
      type: Boolean,
      default: false,
    },
    access: {
      required: true,
      type: Boolean,
      default: false,
    },
    lessonIds: [
      {
        type: Schema.ObjectId,
        ref: "Lesson",
      },
    ],
    order: {
      required: true,
      type: Number,
    },
  },

  {
    timestamps: true,
  }
);

export const ChapterModel = models.Chapter || model("Chapter", chapterSchema);
