"use server";

import { getACategory } from "@/database/queries/categories-data";
import { slugify } from "@/lib/formetData";
import { getCurrentUser } from "@/lib/session";
import { ChapterModel } from "@/models/chapter-model";
import { LessonModel } from "@/models/lesson-model";
import { StudySeriesModel } from "@/models/StudySeries-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

// Validate that the given category (label, group, subject, part) exists in the database
export const validateSeriesCategory = async ({
  label,
  group,
  subject,
  part,
}) => {
  try {
    const category = await getACategory({ label, group, subject, part });

    if (!category) {
      return { success: false, message: "Category Not Found!" };
    }
    return {
      success: true,
      categoryId: category.id,
    };
  } catch (error) {
    return { success: false, message: error?.message || "Category Not Found!" };
  }
};

// Create a new Study Series document in the database
export const createStudySeries = async ({
  title,
  description,
  price,
  outcomes,
  tags,
  thumbnailUrl,

  categoryId,
}) => {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    if (!user || user.role !== "educator") {
      return { success: false, message: "Unauthorized access" };
    }

    const slug = slugify(title);

    const newStudySeries = await StudySeriesModel.create({
      title,
      slug,
      description,
      price,
      outcomes,
      tags,
      thumbnail: thumbnailUrl,
      chapters: [],
      category: new mongoose.Types.ObjectId(categoryId),
      educator: new mongoose.Types.ObjectId(user.id),
      isPublished: false,
    });

    if (!newStudySeries) {
      return { success: false, message: "New Study-Series added failed!" };
    }
    return {
      success: true,
      message: "Study-Series created successfully",
      seriesId: newStudySeries._id.toString(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Could not added new Study-Series: ${error?.message}`,
    };
  }
};

// Update (edit) an existing Study Series by ID
export const updateStudySeries = async (studySeriesId, dataToUpdate) => {
  try {
    await dbConnect();

    const { category, ...rest } = dataToUpdate;

    const updateData = {
      ...rest,
      ...(category && {
        category: new mongoose.Types.ObjectId(category),
      }),
    };

    const updatedStudySeries = await StudySeriesModel.findByIdAndUpdate(
      studySeriesId,
      updateData,
      {
        new: true,
        lean: true,
      }
    );

    if (!updatedStudySeries) {
      return { success: false, message: "Study-Series not found" };
    }

    return {
      success: true,
      message: "Study-Series updated successfully",
      data: updatedStudySeries,
    };
  } catch (e) {
    return {
      success: false,
      message: e?.message || "Something went wrong",
    };
  }
};

// Delete a Study Series and all its related Chapters and Lessons
export const deleteStudySeries = async (studySeriesId) => {
  try {
    await dbConnect();

    // 1 Find the Study Series document by ID
    const series = await StudySeriesModel.findById(studySeriesId)
      .select("chapters")
      .lean();

    if (!series) {
      return { success: false, message: "Study series not found" };
    }

    // 2 Retrieve all related chapters (from embedded array or fallback query)
    const chapterIds = series.chapters?.length
      ? series.chapters
      : (
          await ChapterModel.find({
            studySeries: new mongoose.Types.ObjectId(studySeriesId),
          })
            .select("_id")
            .lean()
        ).map((ch) => ch._id);

    // 3 Delete all lessons under those chapters, then delete the chapters themselves
    if (chapterIds.length > 0) {
      await LessonModel.deleteMany({ chapter: { $in: chapterIds } });
      await ChapterModel.deleteMany({ _id: { $in: chapterIds } });
    }

    // 4  Finally, delete the Study Series document
    const deleted = await StudySeriesModel.findByIdAndDelete(studySeriesId);
    if (!deleted) {
      return { success: false, message: "Series not found or already deleted" };
    }

    return {
      success: true,
      message:
        "Study series and all related chapters & lessons deleted successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: e?.message || "Something went wrong while deleting study series",
    };
  }
};
