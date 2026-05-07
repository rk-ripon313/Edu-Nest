import { BlogComment } from "@/types/blog-comment";
import { Schema, model, models } from "mongoose";

const ReplySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const BlogCommentSchema = new Schema<BlogComment>(
  {
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },

    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: { type: [ReplySchema], default: [] },
  },
  { timestamps: true },
);

export const BlogCommentModel =
  models.BlogComment || model<BlogComment>("BlogComment", BlogCommentSchema);
