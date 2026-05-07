import { Types } from "mongoose";

export interface Blog {
  _id: Types.ObjectId;

  educator: Types.ObjectId;

  title: string;
  slug: string;

  shortDescription?: string;

  content: string;

  images?: string[];

  likes?: Types.ObjectId[];
  comments?: Types.ObjectId[];

  views?: number;

  status: "private" | "published";

  tags?: string[];

  createdAt: Date;
  updatedAt: Date;
}
