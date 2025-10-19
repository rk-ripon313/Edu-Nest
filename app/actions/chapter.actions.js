"use server";

import { slugify } from "@/lib/formetData";
import { getCurrentUser } from "@/lib/session";
import { ChapterModel } from "@/models/chapter-model";
import { LessonModel } from "@/models/lesson-model";
import { StudySeriesModel } from "@/models/StudySeries-model";

import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

// Creates a new chapter for a study series:
export const createChapter = async (data, studySeriesId) => {
  const { title, description, access, isPublished } = data;

  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user || user.role !== "educator") {
      return { success: false, message: "Unauthorized access" };
    }

    //  Convert to ObjectId
    const studySeriesObjectId = new mongoose.Types.ObjectId(studySeriesId);

    //  Finding last Chapter order
    const lastChapter = await ChapterModel.findOne({
      studySeries: studySeriesObjectId,
    })
      .sort({ order: -1 })
      .select("order");

    const nextOrder = lastChapter ? lastChapter.order + 1 : 1;

    const slug = slugify(title);

    //  Create new chapter
    const chapter = await ChapterModel.create({
      title,
      slug,
      description,
      access,
      isPublished,
      educator: new mongoose.Types.ObjectId(user.id),
      studySeries: studySeriesObjectId,
      lessonIds: [],
      order: nextOrder,
    });

    //  Push new chapter ID into StudySeries.chapters array
    await StudySeriesModel.findByIdAndUpdate(
      studySeriesObjectId,
      { $push: { chapters: chapter._id } },
      { new: true }
    );

    revalidatePath(`/dashboard/study-series/${studySeriesId}/edit`);

    return {
      success: true,
      message: "Chapter created successfully",
    };
  } catch (error) {
    console.error("Error creating chapter:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
};

// Updates an existing chapter:
export const updateChapter = async (chapterId, data) => {
  try {
    await dbConnect();

    // If title changed → regenerate slug
    if (data?.title) {
      data.slug = slugify(data.title);
    }

    // Update the document
    const updated = await ChapterModel.findByIdAndUpdate(
      chapterId,
      { $set: data },
      { new: true }
    );
    if (!updated) {
      return { success: false, message: "Chapter not found" };
    }
    revalidatePath(
      `/dashboard/study-series/${updated.studySeries.toString()}/edit`
    );

    return { success: true, message: "Chapter updated successfully" };
  } catch (error) {
    console.error("Update Chapter Error:", error);
    return { success: false, message: "Server error updating chapter" };
  }
};

//  Delete a chapter along with all its lessons
//  and remove the chapter reference from StudySeries

export const deleteChapter = async (chapterId) => {
  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user || user.role !== "educator") {
      return { success: false, message: "Unauthorized access" };
    }

    // Find the chapter first
    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) {
      return { success: false, message: "Chapter not found" };
    }

    const studySeriesId = chapter.studySeries.toString();

    // Delete all lessons of this chapter first
    if (chapter.lessonIds && chapter.lessonIds.length > 0) {
      await LessonModel.deleteMany({ _id: { $in: chapter.lessonIds } });
    }

    // Delete the chapter itself
    const deletedChapter = await ChapterModel.findByIdAndDelete(chapterId);
    if (!deletedChapter) {
      return {
        success: false,
        message: "Chapter could not be deleted or not found",
      };
    }

    // Remove chapter ID from StudySeries.chapters array
    await StudySeriesModel.findByIdAndUpdate(studySeriesId, {
      $pull: { chapters: chapter._id },
    });

    //  revalidate the edit page
    revalidatePath(`/dashboard/study-series/${studySeriesId}/edit`);

    return {
      success: true,
      message: "Chapter and its lessons deleted successfully",
    };
  } catch (error) {
    console.error("Delete Chapter Error:", error);
    return { success: false, message: "Server error deleting chapter" };
  }
};
