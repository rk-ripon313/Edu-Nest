import { Types } from "mongoose";

export interface Chapter {
  _id: Types.ObjectId;

  title: string;
  slug: string;
  description?: string;

  educator: Types.ObjectId;
  studySeries: Types.ObjectId;

  lessonIds: Types.ObjectId[];

  order: number;

  access: boolean;
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}
