import { Model, Schema, model, models } from "mongoose";

export interface HomeHighlightDocument {
  alt: string;
  sortOrder: number;
  imageData: Buffer;
  imageMimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const homeHighlightSchema = new Schema<HomeHighlightDocument>(
  {
    alt: { type: String, trim: true, maxlength: 500, default: "" },
    sortOrder: { type: Number, default: 0 },
    imageData: { type: Buffer, required: true },
    imageMimeType: { type: String, required: true },
  },
  { timestamps: true },
);

homeHighlightSchema.index({ sortOrder: 1, createdAt: 1 });

export const HomeHighlight: Model<HomeHighlightDocument> =
  models.HomeHighlight || model<HomeHighlightDocument>("HomeHighlight", homeHighlightSchema);
