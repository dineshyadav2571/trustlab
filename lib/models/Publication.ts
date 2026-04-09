import { Model, Schema, model, models } from "mongoose";

export const publicationCategories = ["Journals", "Conference", "Books"] as const;
export type PublicationCategory = (typeof publicationCategories)[number];

export interface PublicationDocument {
  category: PublicationCategory;
  text: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const publicationSchema = new Schema<PublicationDocument>(
  {
    category: {
      type: String,
      required: true,
      enum: publicationCategories,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 3000,
    },
    link: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

publicationSchema.index({ category: 1, createdAt: -1 });

export const Publication: Model<PublicationDocument> =
  models.Publication || model<PublicationDocument>("Publication", publicationSchema);
