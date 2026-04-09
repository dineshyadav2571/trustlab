import { Model, Schema, model, models } from "mongoose";

export interface PeopleDocument {
  name: string;
  title: string;
  department: string;
  email: string;
  researchInterests: string;
  profileImageData: Buffer;
  profileImageMimeType: string;
  profileUrl1: string;
  profileUrl2: string;
  createdAt: Date;
  updatedAt: Date;
}

const peopleSchema = new Schema<PeopleDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    researchInterests: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    profileImageData: {
      type: Buffer,
      required: true,
    },
    profileImageMimeType: {
      type: String,
      required: true,
    },
    profileUrl1: {
      type: String,
      required: true,
      trim: true,
    },
    profileUrl2: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

peopleSchema.index({ email: 1 });

export const People: Model<PeopleDocument> =
  models.People || model<PeopleDocument>("People", peopleSchema);
