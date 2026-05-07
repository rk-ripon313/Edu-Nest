import { Report } from "@/types/report";
import { Schema, model, models } from "mongoose";

const reportSchema = new Schema<Report>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studySeries: {
      type: Schema.Types.ObjectId,
      ref: "StudySeries",
      required: true,
    },
    currentWatch: { type: Schema.Types.ObjectId, ref: "Watch" },

    totalCompletedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }], // better naming ->  completedLessonIds or completedLessons
    totalCompletedChapter: [{ type: Schema.Types.ObjectId, ref: "Chapter" }], // better naming -> completedChapterIds or completedChapters
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const ReportModel =
  models.Report || model<Report>("Report", reportSchema);
