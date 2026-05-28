import { Model, Schema, model, models } from "mongoose";

export interface TeachingCourseDocument {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const teachingCourseSchema = new Schema<TeachingCourseDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

teachingCourseSchema.index({ createdAt: 1 });

export const TeachingCourse: Model<TeachingCourseDocument> =
  models.TeachingCourse ||
  model<TeachingCourseDocument>("TeachingCourse", teachingCourseSchema);
