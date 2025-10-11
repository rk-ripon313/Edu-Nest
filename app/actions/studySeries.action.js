"use server";

import { getACategory } from "@/database/queries/categories-data";
import { slugify } from "@/lib/formetData";
import { getCurrentUser } from "@/lib/session";
import { StudySeriesModel } from "@/models/StudySeries-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

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
