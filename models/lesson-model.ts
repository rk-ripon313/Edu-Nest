import { Lesson } from "@/types/lesson";
import { Schema, model, models } from "mongoose";

const lessonSchema = new Schema<Lesson>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },

    videoUrl: { type: String, required: true },
    duration: { type: Number, required: true, default: 0 },

    chapter: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },

    resources: {
      type: [
        {
          title: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      default: [],
    },

    order: { type: Number, required: true },
    access: { type: Boolean, default: true },
    isPreview: { type: Boolean, default: false },
    isPublished: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

export const LessonModel =
  models.Lesson || model<Lesson>("Lesson", lessonSchema);
