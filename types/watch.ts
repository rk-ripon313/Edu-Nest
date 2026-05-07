import { Types } from "mongoose";

export interface Watch {
  _id: Types.ObjectId;

  state: "not-started" | "started" | "in-progress" | "completed";

  lesson: Types.ObjectId;
  chapter: Types.ObjectId;
  student: Types.ObjectId;

  lastTime: number;
  duration: number;

  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
