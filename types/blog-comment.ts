import { Types } from "mongoose";

export interface BlogReply {
  _id?: Types.ObjectId;

  user: Types.ObjectId;
  content: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogComment {
  _id: Types.ObjectId;

  blog: Types.ObjectId;
  user: Types.ObjectId;

  content: string;

  likes?: Types.ObjectId[];
  replies?: BlogReply[];

  createdAt: Date;
  updatedAt: Date;
}
