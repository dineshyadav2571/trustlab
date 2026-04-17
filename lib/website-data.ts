import { connectToDb } from "@/lib/db";
import { WebsiteData } from "@/lib/models/WebsiteData";

export type PublicWebsiteData = {
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
    iconBase64: string;
  };
  about: {
    title: string;
    body: string;
    imageMimeType: string;
    imageBase64: string;
  };
  lead: {
    name: string;
    role: string;
    bio: string;
    scholarUrl: string;
    researchGateUrl: string;
    imageMimeType: string;
    imageBase64: string;
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
};

export const defaultWebsiteData: PublicWebsiteData = {
  branding: {
    labName: "Your Lab Name",
    shortName: "YOUR LAB",
    siteTitle: "Your Lab Name | Research and Innovation",
    siteDescription:
      "A research lab website for innovation, publications, projects, people, and collaborations.",
    heroTitle: "Your Lab Name",
    heroSubtitle: "Research, Innovation, and Collaboration",
    tagline: "Building ideas into impact",
    footerText: "All rights reserved.",
    iconMimeType: "",
    iconBase64: "",
  },
  about: {
    title: "About Us",
    body:
      "This section introduces your lab, its mission, and the broad problems it aims to solve.\n\nUse this space to describe the vision of the lab, the major research themes, and the real-world impact of your work.\n\nYou can also highlight the culture of the lab, your strengths, and what makes the group unique.",
    imageMimeType: "",
    imageBase64: "",
  },
  lead: {
    name: "Dr. Lead Name",
    role: "Principal Investigator / Faculty Lead",
    bio:
      "Write a short professional introduction for the lab lead here.\n\nInclude the lead's expertise, major research interests, and mentoring or collaboration focus.\n\nThis content is shown on the People page above the research scholars.",
    scholarUrl: "https://scholar.google.com/",
    researchGateUrl: "https://www.researchgate.net/",
    imageMimeType: "",
    imageBase64: "",
  },
  contact: {
    addressLine: "D Block Room No: 208\nABV-IIITM Gwalior",
    email: "asy@iiitm.ac.in",
    webUrl: "https://www.iiitm.ac.in/",
    webLinkLabel: "Click here",
    linkedInUrl: "https://www.linkedin.com/",
    linkedInLabel: "Click here",
    mapEmbedUrl: "https://maps.google.com/maps?q=26.2494,78.1867&hl=en&z=16&ie=UTF8&output=embed",
  },
};

function serialize(doc: InstanceType<typeof WebsiteData>): PublicWebsiteData {
  return {
    branding: {
      labName: doc.branding.labName,
      shortName: doc.branding.shortName,
      siteTitle: doc.branding.siteTitle,
      siteDescription: doc.branding.siteDescription,
      heroTitle: doc.branding.heroTitle,
      heroSubtitle: doc.branding.heroSubtitle,
      tagline: doc.branding.tagline,
      footerText: doc.branding.footerText,
      iconMimeType: doc.branding.iconMimeType || "",
      iconBase64: doc.branding.iconData?.length ? doc.branding.iconData.toString("base64") : "",
    },
    about: {
      title: doc.about.title,
      body: doc.about.body,
      imageMimeType: doc.about.imageMimeType || "",
      imageBase64: doc.about.imageData?.length ? doc.about.imageData.toString("base64") : "",
    },
    lead: {
      name: doc.lead.name,
      role: doc.lead.role,
      bio: doc.lead.bio,
      scholarUrl: doc.lead.scholarUrl,
      researchGateUrl: doc.lead.researchGateUrl,
      imageMimeType: doc.lead.imageMimeType || "",
      imageBase64: doc.lead.imageData?.length ? doc.lead.imageData.toString("base64") : "",
    },
    contact: {
      addressLine: doc.contact.addressLine,
      email: doc.contact.email,
      webUrl: doc.contact.webUrl,
      webLinkLabel: doc.contact.webLinkLabel,
      linkedInUrl: doc.contact.linkedInUrl,
      linkedInLabel: doc.contact.linkedInLabel,
      mapEmbedUrl: doc.contact.mapEmbedUrl,
    },
  };
}

export async function getPublicWebsiteData() {
  try {
    await connectToDb();
    const doc = await WebsiteData.findOne();
    if (!doc) {
      return defaultWebsiteData;
    }
    return serialize(doc);
  } catch {
    return defaultWebsiteData;
  }
}
