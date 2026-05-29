import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authenticateRequest } from "@/lib/auth-guard";
import { dbQuery } from "@/lib/db";
import { WebsiteData } from "@/lib/models/WebsiteData";
import {
  getPublicWebsiteData,
  websiteDataMongooseDefaults,
} from "@/lib/website-data";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const dynamic = "force-dynamic";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

async function readImageFile(value: FormDataEntryValue | null) {
  if (!value || !(value instanceof File)) {
    return null;
  }
  if (!value.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (value.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large (max 8 MB).");
  }
  return {
    mimeType: value.type,
    data: Buffer.from(await value.arrayBuffer()),
  };
}

function parseJsonArray<T>(value: FormDataEntryValue | null): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(String(value)) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function clampLimit(value: FormDataEntryValue | null, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(20, Math.max(1, Math.round(n)));
}

export async function GET() {
  const websiteData = await getPublicWebsiteData();
  return NextResponse.json({ websiteData });
}

export async function PATCH(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const formData = await request.formData();

  try {
    const branding = {
      labName: String(formData.get("branding.labName") ?? "").trim(),
      shortName: String(formData.get("branding.shortName") ?? "").trim(),
      siteTitle: String(formData.get("branding.siteTitle") ?? "").trim(),
      siteDescription: String(formData.get("branding.siteDescription") ?? "").trim(),
      heroTitle: String(formData.get("branding.heroTitle") ?? "").trim(),
      heroSubtitle: String(formData.get("branding.heroSubtitle") ?? "").trim(),
      tagline: String(formData.get("branding.tagline") ?? "").trim(),
      footerText: String(formData.get("branding.footerText") ?? "").trim(),
    };
    const about = {
      title: String(formData.get("about.title") ?? "").trim(),
      body: String(formData.get("about.body") ?? "").trim(),
    };
    const lead = {
      name: String(formData.get("lead.name") ?? "").trim(),
      role: String(formData.get("lead.role") ?? "").trim(),
      location: String(formData.get("lead.location") ?? "").trim(),
      phone: String(formData.get("lead.phone") ?? "").trim(),
      cvUrl: String(formData.get("lead.cvUrl") ?? "").trim(),
      bio: String(formData.get("lead.bio") ?? "").trim(),
      scholarUrl: String(formData.get("lead.scholarUrl") ?? "").trim(),
      researchGateUrl: String(formData.get("lead.researchGateUrl") ?? "").trim(),
    };
    const home = {
      aboutSummary: String(formData.get("home.aboutSummary") ?? "").trim(),
      highlightsText: String(formData.get("home.highlightsText") ?? "").trim(),
      researchInterestsText: String(formData.get("home.researchInterestsText") ?? "").trim(),
      recentProjectsLimit: clampLimit(formData.get("home.recentProjectsLimit"), 5),
      recentPublicationsLimit: clampLimit(formData.get("home.recentPublicationsLimit"), 5),
    };
    const contact = {
      addressLine: String(formData.get("contact.addressLine") ?? "").trim(),
      email: String(formData.get("contact.email") ?? "").trim(),
      webUrl: String(formData.get("contact.webUrl") ?? "").trim(),
      webLinkLabel: String(formData.get("contact.webLinkLabel") ?? "").trim(),
      linkedInUrl: String(formData.get("contact.linkedInUrl") ?? "").trim(),
      linkedInLabel: String(formData.get("contact.linkedInLabel") ?? "").trim(),
      mapEmbedUrl: String(formData.get("contact.mapEmbedUrl") ?? "").trim(),
    };

    const profileLinks = parseJsonArray<{
      label?: string;
      url?: string;
      sortOrder?: number;
    }>(formData.get("home.profileLinks"));
    const employment = parseJsonArray<{
      title?: string;
      period?: string;
      description?: string;
      sortOrder?: number;
    }>(formData.get("home.employment"));
    const education = parseJsonArray<{
      degree?: string;
      period?: string;
      details?: string;
      thesisUrl?: string;
      sortOrder?: number;
    }>(formData.get("home.education"));

    if (
      !branding.labName ||
      !branding.shortName ||
      !branding.siteTitle ||
      !branding.siteDescription ||
      !branding.heroTitle ||
      !branding.heroSubtitle ||
      !branding.tagline ||
      !branding.footerText ||
      !about.title ||
      !about.body ||
      !lead.name ||
      !lead.role ||
      !lead.bio ||
      !lead.scholarUrl ||
      !lead.researchGateUrl ||
      !home.aboutSummary ||
      !contact.addressLine ||
      !contact.email ||
      !contact.webUrl ||
      !contact.webLinkLabel ||
      !contact.linkedInUrl ||
      !contact.linkedInLabel ||
      !contact.mapEmbedUrl
    ) {
      return NextResponse.json({ error: "All required website data fields must be filled." }, { status: 400 });
    }

    const brandingIcon = await readImageFile(formData.get("branding.icon"));
    const aboutImage = await readImageFile(formData.get("about.image"));
    const leadImage = await readImageFile(formData.get("lead.image"));

    await dbQuery(async () => {
    const doc = (await WebsiteData.findOne()) || new WebsiteData(websiteDataMongooseDefaults());

    doc.branding.labName = branding.labName;
    doc.branding.shortName = branding.shortName;
    doc.branding.siteTitle = branding.siteTitle;
    doc.branding.siteDescription = branding.siteDescription;
    doc.branding.heroTitle = branding.heroTitle;
    doc.branding.heroSubtitle = branding.heroSubtitle;
    doc.branding.tagline = branding.tagline;
    doc.branding.footerText = branding.footerText;
    if (brandingIcon) {
      doc.branding.iconMimeType = brandingIcon.mimeType;
      doc.branding.iconData = brandingIcon.data;
    }

    doc.about.title = about.title;
    doc.about.body = about.body;
    if (aboutImage) {
      doc.about.imageMimeType = aboutImage.mimeType;
      doc.about.imageData = aboutImage.data;
    }

    doc.lead.name = lead.name;
    doc.lead.role = lead.role;
    doc.lead.location = lead.location;
    doc.lead.phone = lead.phone;
    doc.lead.cvUrl = lead.cvUrl;
    doc.lead.bio = lead.bio;
    doc.lead.scholarUrl = lead.scholarUrl;
    doc.lead.researchGateUrl = lead.researchGateUrl;
    if (leadImage) {
      doc.lead.imageMimeType = leadImage.mimeType;
      doc.lead.imageData = leadImage.data;
    }

    doc.home.aboutSummary = home.aboutSummary;
    doc.home.highlightsText = home.highlightsText;
    doc.home.researchInterestsText = home.researchInterestsText;
    doc.home.recentProjectsLimit = home.recentProjectsLimit;
    doc.home.recentPublicationsLimit = home.recentPublicationsLimit;

    doc.home.profileLinks = profileLinks
      .filter((item) => item.label?.trim() && item.url?.trim())
      .map((item, index) => ({
        label: String(item.label).trim(),
        url: String(item.url).trim(),
        sortOrder: Number.isFinite(item.sortOrder) ? Number(item.sortOrder) : index,
      })) as never;

    doc.home.employment = employment
      .filter((item) => item.title?.trim() && item.period?.trim() && item.description?.trim())
      .map((item, index) => ({
        title: String(item.title).trim(),
        period: String(item.period).trim(),
        description: String(item.description).trim(),
        sortOrder: Number.isFinite(item.sortOrder) ? Number(item.sortOrder) : index,
      })) as never;

    doc.home.education = education
      .filter((item) => item.degree?.trim() && item.period?.trim() && item.details?.trim())
      .map((item, index) => ({
        degree: String(item.degree).trim(),
        period: String(item.period).trim(),
        details: String(item.details).trim(),
        thesisUrl: String(item.thesisUrl ?? "").trim(),
        sortOrder: Number.isFinite(item.sortOrder) ? Number(item.sortOrder) : index,
      })) as never;

    doc.contact.addressLine = contact.addressLine;
    doc.contact.email = contact.email;
    doc.contact.webUrl = contact.webUrl;
    doc.contact.webLinkLabel = contact.webLinkLabel;
    doc.contact.linkedInUrl = contact.linkedInUrl;
    doc.contact.linkedInLabel = contact.linkedInLabel;
    doc.contact.mapEmbedUrl = contact.mapEmbedUrl;

    await doc.save();
    });

    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/projects");
    revalidatePath("/publications");
    revalidatePath("/teaching");
    revalidatePath("/students");
    revalidatePath("/administration");
    revalidatePath("/other-activities");

    const websiteData = await getPublicWebsiteData();
    return NextResponse.json({ websiteData });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save website data." },
      { status: 400 },
    );
  }
}
