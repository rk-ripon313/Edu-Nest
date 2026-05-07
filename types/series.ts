import { Types } from "mongoose";

export interface Series {
  _id: Types.ObjectId;
  id?: string;

  title: string;
  slug: string;
  description?: string;

  category: Types.ObjectId;
  educator: Types.ObjectId;

  thumbnail: string;

  chapters: Types.ObjectId[];

  outcomes: string[];
  tags: string[];

  overviewVideo?: string;

  price: number;
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}
