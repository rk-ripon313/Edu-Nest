import { Schema, model, models } from "mongoose";

const lessonSchema = new Schema(
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
    duration: {
      required: true,
      default: 0,
      type: Number,
    },
    videoUrl: {
      required: false,
      type: String,
    },
    chapter: {
      required: true,
      type: Schema.ObjectId,
      ref: "Chapter",
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      required: true,
      type: Boolean,
      default: false,
    },
    access: {
      // required: true,
      type: Boolean,
      default: true,
    },
    order: {
      required: true,
      type: Number,
    },
    resources: {
      type: [
        {
          title: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

export const LessonModel = models.Lesson || model("Lesson", lessonSchema);
