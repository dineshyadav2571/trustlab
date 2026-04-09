import { Model, Schema, model, models } from "mongoose";

export interface NewsHighlightImage {
  imageData: Buffer;
  imageMimeType: string;
}

export interface NewsHighlightDocument {
  images: NewsHighlightImage[];
  createdAt: Date;
  updatedAt: Date;
}

const newsHighlightImageSchema = new Schema<NewsHighlightImage>(
  {
    imageData: { type: Buffer, required: true },
    imageMimeType: { type: String, required: true },
  },
  { _id: false },
);

const newsHighlightSchema = new Schema<NewsHighlightDocument>(
  {
    images: {
      type: [newsHighlightImageSchema],
      required: true,
      default: [],
    },
  },
  { timestamps: true },
);

export const NewsHighlight: Model<NewsHighlightDocument> =
  models.NewsHighlight ||
  model<NewsHighlightDocument>("NewsHighlight", newsHighlightSchema);
