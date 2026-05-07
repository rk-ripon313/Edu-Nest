import { Types } from "mongoose";

export interface Report {
  _id: Types.ObjectId;

  student: Types.ObjectId;
  studySeries: Types.ObjectId;
  currentWatch?: Types.ObjectId;

  totalCompletedLessons: Types.ObjectId[];
  totalCompletedChapter: Types.ObjectId[];
  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
