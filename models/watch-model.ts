import { Watch } from "@/types/watch";
import { Schema, model, models } from "mongoose";

const watchSchema = new Schema<Watch>(
  {
    state: {
      type: String,
      enum: ["not-started", "started", "in-progress", "completed"],
      default: "not-started",
    },

    lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    chapter: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },

    lastTime: { type: Number, default: 0 },
    duration: { type: Number },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const WatchModel = models.Watch || model<Watch>("Watch", watchSchema);
