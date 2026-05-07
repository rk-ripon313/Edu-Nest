import { Types } from "mongoose";

export interface Book {
  _id: Types.ObjectId;

  title: string;
  slug: string;
  description?: string;

  thumbnail: string;
  fileUrl: string;

  category: Types.ObjectId;
  educator: Types.ObjectId;

  outcomes: string[];
  tags: string[];

  price: number;
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}
