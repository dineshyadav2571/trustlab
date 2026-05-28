import { Model, Schema, model, models, type Types } from "mongoose";

export interface ProfileLinkDocument {
  _id: Types.ObjectId;
  label: string;
  url: string;
  sortOrder: number;
}

export interface EmploymentEntryDocument {
  _id: Types.ObjectId;
  title: string;
  period: string;
  description: string;
  sortOrder: number;
}

export interface EducationEntryDocument {
  _id: Types.ObjectId;
  degree: string;
  period: string;
  details: string;
  thesisUrl: string;
  sortOrder: number;
}

export interface WebsiteDataDocument {
  branding: {
    labName: string;
    shortName: string;
    siteTitle: string;
    siteDescription: string;
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
    location: string;
    phone: string;
    cvUrl: string;
    bio: string;
    scholarUrl: string;
    researchGateUrl: string;
    imageMimeType: string;
    imageData?: Buffer;
  };
  home: {
    aboutSummary: string;
    highlightsText: string;
    researchInterestsText: string;
    recentProjectsLimit: number;
    recentPublicationsLimit: number;
    profileLinks: ProfileLinkDocument[];
    employment: EmploymentEntryDocument[];
    education: EducationEntryDocument[];
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

const profileLinkSchema = new Schema<ProfileLinkDocument>(
  {
    label: { type: String, required: true, trim: true, maxlength: 120 },
    url: { type: String, required: true, trim: true, maxlength: 500 },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true },
);

const employmentEntrySchema = new Schema<EmploymentEntryDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    period: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true },
);

const educationEntrySchema = new Schema<EducationEntryDocument>(
  {
    degree: { type: String, required: true, trim: true, maxlength: 200 },
    period: { type: String, required: true, trim: true, maxlength: 120 },
    details: { type: String, required: true, trim: true, maxlength: 1000 },
    thesisUrl: { type: String, default: "", trim: true, maxlength: 500 },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true },
);

const websiteDataSchema = new Schema<WebsiteDataDocument>(
  {
    branding: {
      labName: { type: String, required: true, trim: true, maxlength: 180 },
      shortName: { type: String, required: true, trim: true, maxlength: 80 },
      siteTitle: { type: String, required: true, trim: true, maxlength: 220 },
      siteDescription: { type: String, required: true, trim: true, maxlength: 500 },
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
      location: { type: String, default: "", trim: true, maxlength: 240 },
      phone: { type: String, default: "", trim: true, maxlength: 80 },
      cvUrl: { type: String, default: "", trim: true, maxlength: 500 },
      bio: { type: String, required: true, trim: true, maxlength: 12000 },
      scholarUrl: { type: String, required: true, trim: true, maxlength: 500 },
      researchGateUrl: { type: String, required: true, trim: true, maxlength: 500 },
      imageMimeType: { type: String, default: "" },
      imageData: { type: Buffer, required: false },
    },
    home: {
      aboutSummary: { type: String, required: true, trim: true, maxlength: 3000 },
      highlightsText: { type: String, required: true, trim: true, maxlength: 8000 },
      researchInterestsText: { type: String, required: true, trim: true, maxlength: 8000 },
      recentProjectsLimit: { type: Number, default: 5, min: 1, max: 20 },
      recentPublicationsLimit: { type: Number, default: 5, min: 1, max: 20 },
      profileLinks: { type: [profileLinkSchema], default: [] },
      employment: { type: [employmentEntrySchema], default: [] },
      education: { type: [educationEntrySchema], default: [] },
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
