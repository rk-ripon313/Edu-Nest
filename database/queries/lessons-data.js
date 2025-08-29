import { replaceMongoIdInObject } from "@/lib/transformId";
import { LessonModel } from "@/models/lesson-model";
import { dbConnect } from "@/service/mongo";

export const getLesson = async (id) => {
  await dbConnect();
  const lesson = await LessonModel.findById(id).lean();
  return replaceMongoIdInObject(lesson);
};
