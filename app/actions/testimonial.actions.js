"use server";

import { getCurrentUser } from "@/lib/session";
import { TestimonialModel } from "@/models/testimonial-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

export const addReviewAction = async ({
  onModel,
  itemId,
  rating,
  comment,
  reviewId,
}) => {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized request" };
    }

    if (reviewId) {
      // Update existing
      const updated = await TestimonialModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(reviewId),
          student: new mongoose.Types.ObjectId(user.id),
          onModel,
        },
        { rating, comment },
        { new: true }
      );

      if (!updated) {
        return { success: false, error: "Review update failed!" };
      }

      return { success: true, message: "Review updated successfully" };
    } else {
      // Create new
      const created = await TestimonialModel.create({
        student: new mongoose.Types.ObjectId(user.id),
        content: new mongoose.Types.ObjectId(itemId),
        onModel,
        rating,
        comment,
      });

      if (!created) {
        return { success: false, error: "Review create failed!" };
      }

      return { success: true, message: "Review created successfully" };
    }
  } catch (error) {
    console.error("Review action error:", error?.message);
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
};

//delate review fn
export const deleteReview = async ({ reviewId, onModel }) => {
  try {
    await dbConnect();
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized request" };
    }

    // Check ownership and delete
    const deleted = await TestimonialModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(reviewId),
      student: new mongoose.Types.ObjectId(user.id),
      onModel,
    });

    if (!deleted) {
      return { success: false, error: "Review not found or not authorized" };
    }

    return { success: true, message: "Review deleted successfully" };
  } catch (error) {
    console.error("Review delete error:", error?.message);
    return {
      success: false,
      error: error?.message || "Something went wrong",
    };
  }
};
