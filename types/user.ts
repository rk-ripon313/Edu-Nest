import { Types } from "mongoose";

export type UserRole = "student" | "educator" | "admin";

export interface SocialLinks {
  facebook?: string;
  linkedin?: string;
  website?: string;
}

export interface EducatorProfile {
  bio?: string;
  expertise?: string[];
  qualification?: string;
  socialLinks?: SocialLinks;
  isVerified?: boolean;
}

export interface User {
  _id: Types.ObjectId;

  firstName?: string;
  lastName?: string;

  email: string;
  userName?: string;
  password?: string;

  image?: string;
  role: "student" | "educator" | "admin";

  isEmailVerified: boolean;

  educatorProfile?: {
    bio?: string;
    expertise: string[];
    qualification?: string;

    socialLinks?: {
      facebook?: string;
      linkedin?: string;
      website?: string;
    };

    isVerified: boolean;
  };

  following: Types.ObjectId[];
  followers: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}
