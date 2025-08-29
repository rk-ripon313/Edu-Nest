// "use server";

// import { getLesson } from "@/database/queries/lessons-data";
// import {
//   createAReport,
//   updateCurrentLesson,
// } from "@/database/queries/reports-data";
// import { getCurrentUser } from "@/lib/session";
// import { ReportModel } from "@/models/repport-model";
// import { WatchModel } from "@/models/watch-model";
// import { dbConnect } from "@/service/mongo";
// import mongoose from "mongoose";

// export const updateLessonWatch = async ({
//   studySeriesId,
//   chapterId,
//   lessonId,
//   state,
//   lastTime,
//   duration,
// }) => {
//   const VALID_STATES = ["started", "in-progress", "completed"];

//   if (!VALID_STATES.includes(state)) {
//     throw new Error("Invalid state. Must be started or completed.");
//   }

//   try {
//     await dbConnect();

//     const [hasLesson, user] = await Promise.all([
//       getLesson(lessonId),
//       getCurrentUser(),
//     ]);
//     if (!hasLesson || !user) throw new Error("Invalid lesson or user data.");

//     const studySeries = new mongoose.Types.ObjectId(studySeriesId);
//     const student = new mongoose.Types.ObjectId(user.id);
//     const chapter = new mongoose.Types.ObjectId(chapterId);
//     const lesson = new mongoose.Types.ObjectId(lessonId);

//     let existingWatch = await WatchModel.findOne({
//       lesson,
//       chapter,
//       student,
//     }).lena();

//     //finding existtingReport if not then create one..
//     let report = await ReportModel.findOne({ studySeries, student }).lean();
//     if (!report) {
//       report = await createAReport({ studySeries, student });
//     }

//     if (!existingWatch) {
//       const newWatch = await WatchModel.create({
//         state,
//         lesson,
//         chapter,
//         student,
//         lastTime,
//         duration,
//         completedAt: state === "completed" ? new Date() : undefined,
//       });
//       await updateCurrentLesson({
//         reportID: report._id,
//         currentLesson: newWatch._id,
//       });
//     } else if (state === "started" && existingWatch.state === "not-started") {
//       //started logic
//       existingWatch.state = state;
//       existingWatch.lastTime = lastTime;
//       existingWatch.duration = duration;
//       await existingWatch.save();
//       await updateCurrentLesson({
//         reportID: report._id,
//         currentLesson: existingWatch._id,
//       });
//     } else if (state === "in-progress" && existingWatch.state !== "completed") {
//       // progressing logic
//       existingWatch.state = state;
//       existingWatch.lastTime = lastTime;
//       existingWatch.duration = duration;
//       await existingWatch.save();
//       await updateCurrentLesson({
//         reportID: report._id,
//         currentLesson: existingWatch._id,
//       });
//     } else if (state === "completed" && existingWatch.state !== "completed") {
//       // colplited logic
//       existingWatch.state = state;
//       existingWatch.lastTime = lastTime;
//       existingWatch.duration = duration;
//       existingWatch.completedAt = new Date();
//       await existingWatch.save();
//       await updateCurrentLesson({
//         reportID: report._id,
//         currentLesson: existingWatch._id,
//       });
//       ///here update the report like push thin complided lesson to report totalcomplited lesson etc ect ..
//     }
//   } catch (error) {
//     console.error("updateLessonWatch failed:", error);
//     throw new Error(`Could not update lesson progress: ${error.message}`);
//   }
// };

"use server";

import { getLesson } from "@/database/queries/lessons-data";
import {
  createAReport,
  updateCurrentLesson,
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
      watch.state = state;
      watch.lastTime = lastTime;
      if (state === "completed") watch.completedAt = new Date();
      await watch.save();
    }

    // --- Report ---
    let report = await ReportModel.findOne({ studySeries, student });
    if (!report) {
      report = await createAReport({ studySeries, student });
    }

    // currentLesson update
    await updateCurrentLesson({
      reportID: report._id,
      currentLesson: watch._id,
    });

    // if completed → call helper Fn..
    if (state === "completed") {
      await updateReportOnCompleted(report, lesson, chapter);
    }

    return { success: true };
  } catch (err) {
    console.error("updateLessonWatch failed:", err);
    throw new Error(`Could not update lesson progress: ${err.message}`);
  }
};
