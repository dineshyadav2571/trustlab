import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-guard";
import { connectToDb } from "@/lib/db";
import { WebsiteData } from "@/lib/models/WebsiteData";
import { defaultWebsiteData, getPublicWebsiteData } from "@/lib/website-data";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

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
      bio: String(formData.get("lead.bio") ?? "").trim(),
      scholarUrl: String(formData.get("lead.scholarUrl") ?? "").trim(),
      researchGateUrl: String(formData.get("lead.researchGateUrl") ?? "").trim(),
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
      !contact.addressLine ||
      !contact.email ||
      !contact.webUrl ||
      !contact.webLinkLabel ||
      !contact.linkedInUrl ||
      !contact.linkedInLabel ||
      !contact.mapEmbedUrl
    ) {
      return NextResponse.json({ error: "All website data fields are required." }, { status: 400 });
    }

    const brandingIcon = await readImageFile(formData.get("branding.icon"));
    const aboutImage = await readImageFile(formData.get("about.image"));
    const leadImage = await readImageFile(formData.get("lead.image"));

    await connectToDb();
    const doc = (await WebsiteData.findOne()) || new WebsiteData(defaultWebsiteData);

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
    doc.lead.bio = lead.bio;
    doc.lead.scholarUrl = lead.scholarUrl;
    doc.lead.researchGateUrl = lead.researchGateUrl;
    if (leadImage) {
      doc.lead.imageMimeType = leadImage.mimeType;
      doc.lead.imageData = leadImage.data;
    }

    doc.contact.addressLine = contact.addressLine;
    doc.contact.email = contact.email;
    doc.contact.webUrl = contact.webUrl;
    doc.contact.webLinkLabel = contact.webLinkLabel;
    doc.contact.linkedInUrl = contact.linkedInUrl;
    doc.contact.linkedInLabel = contact.linkedInLabel;
    doc.contact.mapEmbedUrl = contact.mapEmbedUrl;

    await doc.save();

    const websiteData = await getPublicWebsiteData();
    return NextResponse.json({ websiteData });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save website data." },
      { status: 400 },
    );
  }
}
