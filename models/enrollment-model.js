import { Schema, model, models } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: true,
    },
    onModel: { type: String, required: true, enum: ["Book", "StudySeries"] },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "free", "paid", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "sslcommerz", "free", "manual"],
      default: "free",
    },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const EnrollmentModel =
  models.Enrollment || model("Enrollment", EnrollmentSchema);
