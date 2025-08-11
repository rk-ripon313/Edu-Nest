import { Schema, model, models } from "mongoose";

const StudySeriesSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    thumbnail: { type: String },
    educator: { type: Schema.Types.ObjectId, ref: "User", required: true },

    level: { type: String },
    group: { type: String },
    subject: { type: String },

    chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
    outComes: [{ type: String }],
    tags: [{ type: String }],
    overviewVideo: { type: String },

    price: { type: Number, default: 0, required: true },
    isPublished: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

export const StudySeriesModel =
  models.StudySeries || model("StudySeries", StudySeriesSchema);
