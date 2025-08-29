import { Schema, model, models } from "mongoose";

const watchSchema = new Schema(
  {
    state: {
      type: String,
      enum: ["not-started", "started", "in-progress", "completed"],
      default: "not-started",
    },
    lesson: { type: Schema.ObjectId, ref: "Lesson", required: true },
    chapter: { type: Schema.ObjectId, ref: "Chapter", required: true },
    student: { type: Schema.ObjectId, ref: "User", required: true },

    lastTime: { type: Number, default: 0 },
    duration: { type: Number },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const WatchModel = models.Watch || model("Watch", watchSchema);
