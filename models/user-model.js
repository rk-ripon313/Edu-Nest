import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { required: true, type: String },
    lastName: { required: true, type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    userName: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "educator", "admin"],
      default: "student",
    },

    isEmailVerified: { type: Boolean, default: false },

    //  Educator profile
    educatorProfile: {
      bio: { type: String },
      expertise: [{ type: String }],
      qualification: { type: String },
      socialLinks: {
        facebook: { type: String },
        linkedin: { type: String },
        website: { type: String },
      },

      isVerified: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const UserModel = models.User || model("User", userSchema);
