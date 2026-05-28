import { Model, Schema, model, models } from "mongoose";

export const supervisedStudentCategories = [
  "Ph.D. Ongoing",
  "M.Tech Students",
  "B.Tech Students",
  "External Thesis (BITS Pilani)",
] as const;

export type SupervisedStudentCategory = (typeof supervisedStudentCategories)[number];

export interface SupervisedStudentDocument {
  category: SupervisedStudentCategory;
  nameLine: string;
  topic: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const supervisedStudentSchema = new Schema<SupervisedStudentDocument>(
  {
    category: {
      type: String,
      required: true,
      enum: supervisedStudentCategories,
    },
    nameLine: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 500,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 2000,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

supervisedStudentSchema.index({ category: 1, sortOrder: 1, createdAt: 1 });

export const SupervisedStudent: Model<SupervisedStudentDocument> =
  models.SupervisedStudent ||
  model<SupervisedStudentDocument>("SupervisedStudent", supervisedStudentSchema);
