import { Types } from "mongoose";

export interface Category {
  _id: Types.ObjectId;

  title: string;
  slug: string;
  thumbnail?: string;

  label: "SSC" | "HSC" | "Admission" | "Others";
  group:
    | "Science"
    | "Commerce"
    | "Arts"
    | "General"
    | "Medical"
    | "Engineering"
    | "Others";

  subject: string;
  part?: "1st" | "2nd";

  createdAt: Date;
  updatedAt: Date;
}
