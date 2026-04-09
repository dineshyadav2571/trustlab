import { Model, Schema, model, models } from "mongoose";

export interface ResearchProjectDocument {
  title: string;
  clgName: string;
  bugged: string;
  imageData: Buffer;
  imageMimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const researchProjectSchema = new Schema<ResearchProjectDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    clgName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    bugged: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
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

export const ResearchProject: Model<ResearchProjectDocument> =
  models.ResearchProject ||
  model<ResearchProjectDocument>("ResearchProject", researchProjectSchema);
