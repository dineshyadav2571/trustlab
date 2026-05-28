import { Model, Schema, model, models, type Types } from "mongoose";

export const otherActivityListStyles = ["default", "award"] as const;
export type OtherActivityListStyle = (typeof otherActivityListStyles)[number];

export interface OtherActivityItemDocument {
  _id: Types.ObjectId;
  text: string;
  sortOrder: number;
}

export interface OtherActivitySectionDocument {
  title: string;
  sortOrder: number;
  listStyle: OtherActivityListStyle;
  items: OtherActivityItemDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const otherActivityItemSchema = new Schema<OtherActivityItemDocument>(
  {
    text: {
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
  { _id: true },
);

const otherActivitySectionSchema = new Schema<OtherActivitySectionDocument>(
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
    listStyle: {
      type: String,
      enum: otherActivityListStyles,
      default: "default",
    },
    items: {
      type: [otherActivityItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

otherActivitySectionSchema.index({ sortOrder: 1, createdAt: 1 });

export const OtherActivitySection: Model<OtherActivitySectionDocument> =
  models.OtherActivitySection ||
  model<OtherActivitySectionDocument>("OtherActivitySection", otherActivitySectionSchema);
