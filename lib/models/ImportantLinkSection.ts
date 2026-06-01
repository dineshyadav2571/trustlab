import { Model, Schema, model, models, type Types } from "mongoose";
import {
  importantLinkIcons,
  importantLinkLayouts,
  type ImportantLinkIcon,
  type ImportantLinkLayout,
} from "@/lib/important-link-types";

export {
  importantLinkIcons,
  importantLinkLayouts,
  type ImportantLinkIcon,
  type ImportantLinkLayout,
} from "@/lib/important-link-types";

export interface ImportantLinkItemDocument {
  _id: Types.ObjectId;
  icon: ImportantLinkIcon;
  title: string;
  url: string;
  description: string;
  sortOrder: number;
}

export interface ImportantLinkCategoryDocument {
  _id: Types.ObjectId;
  title: string;
  sortOrder: number;
  links: ImportantLinkItemDocument[];
}

export interface ImportantLinkSectionDocument {
  title: string;
  intro: string;
  layout: ImportantLinkLayout;
  sortOrder: number;
  categories: ImportantLinkCategoryDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const importantLinkItemSchema = new Schema<ImportantLinkItemDocument>(
  {
    icon: {
      type: String,
      enum: importantLinkIcons,
      default: "link",
    },
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 300 },
    url: { type: String, required: true, trim: true, maxlength: 2000 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true },
);

const importantLinkCategorySchema = new Schema<ImportantLinkCategoryDocument>(
  {
    title: { type: String, trim: true, maxlength: 300, default: "" },
    sortOrder: { type: Number, default: 0 },
    links: { type: [importantLinkItemSchema], default: [] },
  },
  { _id: true },
);

const importantLinkSectionSchema = new Schema<ImportantLinkSectionDocument>(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 300 },
    intro: { type: String, trim: true, maxlength: 4000, default: "" },
    layout: { type: String, enum: importantLinkLayouts, default: "grouped" },
    sortOrder: { type: Number, default: 0 },
    categories: { type: [importantLinkCategorySchema], default: [] },
  },
  { timestamps: true },
);

importantLinkSectionSchema.index({ sortOrder: 1, createdAt: 1 });

export const ImportantLinkSection: Model<ImportantLinkSectionDocument> =
  models.ImportantLinkSection ||
  model<ImportantLinkSectionDocument>("ImportantLinkSection", importantLinkSectionSchema);
