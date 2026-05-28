import { Model, Schema, model, models, type Types } from "mongoose";

export interface AdministrationItemDocument {
  _id: Types.ObjectId;
  text: string;
  sortOrder: number;
}

export interface AdministrationSectionDocument {
  title: string;
  sortOrder: number;
  items: AdministrationItemDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const administrationItemSchema = new Schema<AdministrationItemDocument>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 500,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
);

const administrationSectionSchema = new Schema<AdministrationSectionDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 300,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    items: {
      type: [administrationItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

administrationSectionSchema.index({ sortOrder: 1, createdAt: 1 });

export const AdministrationSection: Model<AdministrationSectionDocument> =
  models.AdministrationSection ||
  model<AdministrationSectionDocument>(
    "AdministrationSection",
    administrationSectionSchema,
  );
