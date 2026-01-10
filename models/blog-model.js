import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    // Only educator can post
    educator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    shortDescription: {
      type: String,
      maxlength: 300,
    },

    content: {
      type: String, // full HTML/Markdown
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "BlogComment",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["private", "published"],
      default: "published",
    },
    tags: [{ type: String, lowercase: true }],
  },

  { timestamps: true }
);

export const BlogModel = models.Blog || model("Blog", BlogSchema);
