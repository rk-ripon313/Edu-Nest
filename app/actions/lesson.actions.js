"use server";

import { slugify } from "@/lib/formetData";
import { getCurrentUser } from "@/lib/session";
import { ChapterModel } from "@/models/chapter-model";
import { LessonModel } from "@/models/lesson-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

export const createLesson = async ({
  data,
  resources,
  duration,
  videoUrl,
  chapterId,
}) => {
  const { title, description, isPreview, isPublished } = data;
  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user || user.role !== "educator") {
      return { success: false, message: "Unauthorized access" };
    }

    //  Convert to ObjectId
    const chapterObjectId = new mongoose.Types.ObjectId(chapterId);

    //  Finding last lesson order
    const lastLesson = await LessonModel.findOne({
      chapter: chapterObjectId,
    })
      .sort({ order: -1 })
      .select("order");

    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    const slug = slugify(title);

    //  Create new Lesson
    const lesson = await LessonModel.create({
      title,
      slug,
      description,
      duration,
      videoUrl,
      chapter: chapterObjectId,
      isPreview,
      isPublished,
      order: nextOrder,
      resources,
    });

    if (!lesson) {
      return {
        success: false,
        message: "Lesson created failed",
      };
    }
    //  Push new lesson ID into chapters.lessonIds array
    await ChapterModel.findByIdAndUpdate(
      chapterObjectId,
      { $push: { lessonIds: lesson._id } },
      { new: true }
    );

    // revalidatePath(`/dashboard/study-series/${studySeriesId}/edit`);

    return {
      success: true,
      message: "Lesson created successfully",
    };
  } catch (error) {
    console.error("Error creating Lesson:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
};
