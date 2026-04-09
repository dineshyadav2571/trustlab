import { Model, Schema, model, models } from "mongoose";

export const patentCategories = ["Granted", "Published"] as const;
export type PatentCategory = (typeof patentCategories)[number];

export interface PatentDocument {
  category: PatentCategory;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const patentSchema = new Schema<PatentDocument>(
  {
    category: {
      type: String,
      required: true,
      enum: patentCategories,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 3000,
    },
  },
  { timestamps: true },
);

patentSchema.index({ category: 1, createdAt: -1 });

export const Patent: Model<PatentDocument> =
  models.Patent || model<PatentDocument>("Patent", patentSchema);
