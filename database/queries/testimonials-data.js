import { replaceMongoIdInArray } from "@/lib/transformId";
import { TestimonialModel } from "@/models/testimonial-model";
import { UserModel } from "@/models/user-model";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";

export const getTestimonials = async (onModel, itemId) => {
  try {
    await dbConnect();

    const reviews = await TestimonialModel.find({
      onModel: onModel,
      content: new mongoose.Types.ObjectId(itemId),
    })
      .populate({
        path: "student",
        model: UserModel,
        select: "image firstName lastName userName",
      })
      .sort({ createdAt: -1 })
      .lean();
    return replaceMongoIdInArray(reviews);
  } catch (error) {
    console.error("fetch Fail");
    return [];
  }
};
