import { Schema, model, models } from "mongoose";

const reportSchema = new Schema(
  {
    totalCompletedLessons: [
      {
        type: Schema.ObjectId,
        ref: "Lesson",
        default: [],
      },
    ],

    totalCompletedChapter: [
      {
        type: Schema.ObjectId,
        ref: "Chapter",
        default: [],
      },
    ],

    currentWatch: {
      type: Schema.ObjectId,
      ref: "Watch",
    },
    studySeries: {
      type: Schema.ObjectId,
      ref: "StudySeries",
      required: true,
    },

    student: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },

    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const ReportModel = models.Report || model("Report", reportSchema);
