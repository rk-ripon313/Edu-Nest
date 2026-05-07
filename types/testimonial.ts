import { Types } from "mongoose";

export interface Testimonial {
  _id: Types.ObjectId;

  student: Types.ObjectId;

  content: Types.ObjectId;
  onModel: "Book" | "StudySeries";

  rating: number;
  comment?: string;

  createdAt: Date;
  updatedAt: Date;
}
