import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { required: true, type: String },
    lastName: { required: true, type: String },
    email: { required: true, type: String, unique: true },
    userName: { required: false, type: String },
    password: { required: true, type: String },
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
