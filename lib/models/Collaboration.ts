import { Model, Schema, model, models } from "mongoose";

export interface CollaborationDocument {
  text: string;
  imageData: Buffer;
  imageMimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const collaborationSchema = new Schema<CollaborationDocument>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 3000,
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

export const Collaboration: Model<CollaborationDocument> =
  models.Collaboration ||
  model<CollaborationDocument>("Collaboration", collaborationSchema);
