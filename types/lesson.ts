import { Types } from "mongoose";

export interface Lesson {
  _id: Types.ObjectId;

  title: string;
  slug: string;
  description?: string;

  videoUrl: string;
  duration: number;

  chapter: Types.ObjectId;

  resources: { title: string; url: string }[];

  order: number;

  access: boolean;
  isPreview: boolean;
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}
