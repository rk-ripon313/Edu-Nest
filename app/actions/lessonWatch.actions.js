"use server";

import { getLesson } from "@/database/queries/lessons-data";
import {
  createAReport,
  updateCurrentWatch,
  updateReportOnCompleted,
} from "@/database/queries/reports-data";
import { getCurrentUser } from "@/lib/session";
import { ReportModel } from "@/models/repport-model";
import { WatchModel } from "@/models/watch-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

export const updateLessonWatch = async ({
  studySeriesId,
  chapterId,
  lessonId,
  state,
  lastTime,
  duration,
}) => {
  const VALID_STATES = ["started", "in-progress", "completed"];
  if (!VALID_STATES.includes(state)) throw new Error("Invalid state.");

  try {
    await dbConnect();

    const [lessonDoc, user] = await Promise.all([
      getLesson(lessonId),
      getCurrentUser(),
    ]);
    if (!lessonDoc || !user) throw new Error("Invalid lesson or user.");

    const studySeries = new mongoose.Types.ObjectId(studySeriesId);
    const student = new mongoose.Types.ObjectId(user.id);
    const chapter = new mongoose.Types.ObjectId(chapterId);
    const lesson = new mongoose.Types.ObjectId(lessonId);

    // --- Watch ---
    let watch = await WatchModel.findOne({ lesson, student });
    if (!watch) {
      watch = await WatchModel.create({
        lesson,
        chapter,
        student,
        state,
        lastTime,
        duration,
        completedAt: state === "completed" ? new Date() : undefined,
      });
    } else {
      // Already exists → only update if allowed
      if (watch.state === "completed") {
        // completed lesson -> do nothing
      } else if (watch.state === "in-progress" && state === "started") {
        // do nothing
      } else {
        // safe to update
        watch.state = state;
        watch.lastTime = lastTime;
        if (state === "completed") watch.completedAt = new Date();
      }

      await watch.save();
    }

    // --- Report ---
    let report = await ReportModel.findOne({ studySeries, student });
    if (!report) {
      report = await createAReport({ studySeries, student });
      if (!report) throw new Error("Failed to create report for student");
    }

    // currentLesson update
    await updateCurrentWatch({
      reportID: report._id,
      currentWatch: watch._id,
    });

    // if completed → call helper Fn..
    if (state === "completed") {
      await updateReportOnCompleted(report, lesson, chapter);
      // revalidatePath(`/study-series/${studySeriesId}/play`);
    }

    return { success: true };
  } catch (err) {
    console.error("updateLessonWatch failed:", err);
    throw new Error(`Could not update lesson progress: ${err.message}`);
  }
};
