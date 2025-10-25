"use server";

import { slugify } from "@/lib/formetData";
import { getCurrentUser } from "@/lib/session";
import { ChapterModel } from "@/models/chapter-model";
import { LessonModel } from "@/models/lesson-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

// Creates a new Lesson
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

// Update an existing Lesson:
export const updateLesson = async (data) => {
  try {
    await dbConnect();

    // If title changed → regenerate slug
    if (data?.title) {
      data.slug = slugify(data.title);
    }

    // Update the document
    const updated = await LessonModel.findByIdAndUpdate(
      data.lessonId,
      { $set: data },
      { new: true }
    );
    if (!updated) {
      return { success: false, message: "Lesson not found" };
    }

    return { success: true, message: "Lesson updated successfully" };
  } catch (error) {
    console.error("Update Lesson Error:", error);
    return { success: false, message: "Server error updating Lesson" };
  }
};

//  Delete lesson and remove the lessonId reference from Chapter
export const deleteLesson = async (lessonId) => {
  try {
    await dbConnect();

    // Find the lesson first
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) {
      return { success: false, message: "Lesson not found" };
    }

    const chapterId = lesson.chapter.toString();

    // Delete the lesson itself
    const deletedLesson = await LessonModel.findByIdAndDelete(lessonId);
    if (!deletedLesson) {
      return {
        success: false,
        message: "Lesson could not be deleted or not found",
      };
    }

    // Remove lesson ID from chapter.lessonIds array
    await ChapterModel.findByIdAndUpdate(chapterId, {
      $pull: { lessonIds: lesson._id },
    });

    return {
      success: true,
      message: "Lesson deleted successfully",
    };
  } catch (error) {
    console.error("Delete Lesson Error:", error);
    return { success: false, message: "Server error deleting lesson" };
  }
};
