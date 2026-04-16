import { Model, Schema, model, models } from "mongoose";

export interface WebsiteDataDocument {
  branding: {
    labName: string;
    shortName: string;
    heroTitle: string;
    heroSubtitle: string;
    tagline: string;
    footerText: string;
    iconMimeType: string;
    iconData?: Buffer;
  };
  about: {
    title: string;
    body: string;
    imageMimeType: string;
    imageData?: Buffer;
  };
  lead: {
    name: string;
    role: string;
    bio: string;
    scholarUrl: string;
    researchGateUrl: string;
    imageMimeType: string;
    imageData?: Buffer;
  };
  contact: {
    addressLine: string;
    email: string;
    webUrl: string;
    webLinkLabel: string;
    linkedInUrl: string;
    linkedInLabel: string;
    mapEmbedUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const websiteDataSchema = new Schema<WebsiteDataDocument>(
  {
    branding: {
      labName: { type: String, required: true, trim: true, maxlength: 180 },
      shortName: { type: String, required: true, trim: true, maxlength: 80 },
      heroTitle: { type: String, required: true, trim: true, maxlength: 180 },
      heroSubtitle: { type: String, required: true, trim: true, maxlength: 180 },
      tagline: { type: String, required: true, trim: true, maxlength: 180 },
      footerText: { type: String, required: true, trim: true, maxlength: 200 },
      iconMimeType: { type: String, default: "" },
      iconData: { type: Buffer, required: false },
    },
    about: {
      title: { type: String, required: true, trim: true, maxlength: 120 },
      body: { type: String, required: true, trim: true, maxlength: 12000 },
      imageMimeType: { type: String, default: "" },
      imageData: { type: Buffer, required: false },
    },
    lead: {
      name: { type: String, required: true, trim: true, maxlength: 140 },
      role: { type: String, required: true, trim: true, maxlength: 240 },
      bio: { type: String, required: true, trim: true, maxlength: 12000 },
      scholarUrl: { type: String, required: true, trim: true, maxlength: 500 },
      researchGateUrl: { type: String, required: true, trim: true, maxlength: 500 },
      imageMimeType: { type: String, default: "" },
      imageData: { type: Buffer, required: false },
    },
    contact: {
      addressLine: { type: String, required: true, trim: true, maxlength: 1000 },
      email: { type: String, required: true, trim: true, maxlength: 200 },
      webUrl: { type: String, required: true, trim: true, maxlength: 500 },
      webLinkLabel: { type: String, required: true, trim: true, maxlength: 120 },
      linkedInUrl: { type: String, required: true, trim: true, maxlength: 500 },
      linkedInLabel: { type: String, required: true, trim: true, maxlength: 120 },
      mapEmbedUrl: { type: String, required: true, trim: true, maxlength: 2000 },
    },
  },
  { timestamps: true },
);

export const WebsiteData: Model<WebsiteDataDocument> =
  models.WebsiteData || model<WebsiteDataDocument>("WebsiteData", websiteDataSchema);

