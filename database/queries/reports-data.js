import { ChapterModel } from "@/models/chapter-model";
import { ReportModel } from "@/models/repport-model";
import { dbConnect } from "@/service/mongo";

//crating a new report
export const createAReport = async (data) => {
  await dbConnect();
  const report = await ReportModel.create(data);
  return report;
};

//updateing current playing lesson.
export const updateCurrentLesson = async ({ reportID, currentLesson }) => {
  await dbConnect();
  await ReportModel.findByIdAndUpdate(reportID, { currentLesson }).lean();
};

//updating report when any lesson is complited
export const updateReportOnCompleted = async (report, lessonId, chapterId) => {
  //  lesson push when it compited
  if (!report.totalCompletedLessons.some((id) => id.equals(lessonId))) {
    report.totalCompletedLessons.push(lessonId);
  }

  //  chapter push when it compited
  const chapterDoc = await ChapterModel.findById(chapterId).lean();
  const allLessons = chapterDoc.lessonIds.map((id) => id.toString());
  const completedLessons = report.totalCompletedLessons.map((id) =>
    id.toString()
  );

  const allDone = allLessons.every((id) => completedLessons.includes(id));
  if (
    allDone &&
    !report.totalCompletedChapter.some((id) => id.equals(chapterId))
  ) {
    report.totalCompletedChapter.push(chapterId);
  }

  await report.save();
};
