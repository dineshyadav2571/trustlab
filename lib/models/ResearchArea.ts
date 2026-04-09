import { Model, Schema, model, models } from "mongoose";

export interface ResearchAreaDocument {
  title: string;
  description: string;
  imageData: Buffer;
  imageMimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const researchAreaSchema = new Schema<ResearchAreaDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    imageData: {
      type: Buffer,
      required: true,
    },
    imageMimeType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const ResearchArea: Model<ResearchAreaDocument> =
  models.ResearchArea ||
  model<ResearchAreaDocument>("ResearchArea", researchAreaSchema);
