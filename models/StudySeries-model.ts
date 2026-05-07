import { Series } from "@/types/series";
import { Schema, model, models } from "mongoose";

const StudySeriesSchema = new Schema<Series>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },

    thumbnail: { type: String, required: true },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    educator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],

    outcomes: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    overviewVideo: { type: String },

    price: { type: Number, default: 0, required: true },
    isPublished: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);

export const StudySeriesModel =
  models.StudySeries || model<Series>("StudySeries", StudySeriesSchema);
