import { Schema, model, models } from "mongoose";
const TestimonialSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: true,
    },
    onModel: { type: String, required: true, enum: ["Book", "StudySeries"] },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);
export const TestimonialModel =
  models.Testimonial || model("Testimonial", TestimonialSchema);
