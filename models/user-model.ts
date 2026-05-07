import { User } from "@/types/user";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema<User>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    userName: { type: String },
    password: { type: String },
    image: { type: String },
    role: {
      type: String,
      enum: ["student", "educator", "admin"],
      default: "student",
    },

    isEmailVerified: { type: Boolean, default: false },

    //  Educator profile
    educatorProfile: {
      bio: { type: String },
      expertise: { type: [String], default: [] },
      qualification: { type: String },
      socialLinks: {
        facebook: { type: String },
        linkedin: { type: String },
        website: { type: String },
      },

      isVerified: { type: Boolean, default: false },
    },
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export const UserModel = models.User || model<User>("User", userSchema);
