import { Model, Schema, model, models } from "mongoose";

export const achievementCategories = [
  "Achievements",
  "Invited Talks",
  "Short term program conducted",
] as const;
export type AchievementCategory = (typeof achievementCategories)[number];

export interface AchievementDocument {
  category: AchievementCategory;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<AchievementDocument>(
  {
    category: {
      type: String,
      required: true,
      enum: achievementCategories,
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

achievementSchema.index({ category: 1, createdAt: -1 });

export const Achievement: Model<AchievementDocument> =
  models.Achievement || model<AchievementDocument>("Achievement", achievementSchema);
