import { dbQuery } from "@/lib/db";
import { toImageBuffer } from "@/lib/image-buffer";
import { WebsiteData } from "@/lib/models/WebsiteData";

export function websiteDataImageUrl(slot: "lead" | "branding" | "about") {
  return `/api/website-data/images/${slot}`;
}

export type ProfileLinkPublic = {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
};

export type EmploymentEntryPublic = {
  id: string;
  title: string;
  period: string;
  description: string;
  sortOrder: number;
};

export type EducationEntryPublic = {
  id: string;
  degree: string;
  period: string;
  details: string;
  thesisUrl: string;
  sortOrder: number;
};

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
    iconUrl: string;
  };
  about: {
    title: string;
    body: string;
    imageMimeType: string;
    imageBase64: string;
    imageUrl: string;
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
    imageBase64: string;
    imageUrl: string;
  };
  home: {
    aboutSummary: string;
    highlights: string[];
    researchInterests: string[];
    recentProjectsLimit: number;
    recentPublicationsLimit: number;
    profileLinks: ProfileLinkPublic[];
    employment: EmploymentEntryPublic[];
    education: EducationEntryPublic[];
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

function parseLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Copy BSON buffers before base64 — avoids detached ArrayBuffer errors in Next.js RSC. */
function bufferToBase64(value?: Buffer | Uint8Array | null) {
  if (!value || !value.length) return "";
  return Buffer.from(value).toString("base64");
}

type WebsiteDataRecord = {
  branding: {
    labName: string;
    shortName: string;
    siteTitle: string;
    siteDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    tagline: string;
    footerText: string;
    iconMimeType?: string;
    iconData?: Buffer;
  };
  about: {
    title: string;
    body: string;
    imageMimeType?: string;
    imageData?: Buffer;
  };
  lead: {
    name: string;
    role: string;
    location?: string;
    phone?: string;
    cvUrl?: string;
    bio: string;
    scholarUrl: string;
    researchGateUrl: string;
    imageMimeType?: string;
    imageData?: Buffer;
  };
  home?: {
    aboutSummary?: string;
    highlightsText?: string;
    researchInterestsText?: string;
    recentProjectsLimit?: number;
    recentPublicationsLimit?: number;
    profileLinks?: { _id?: unknown; label: string; url: string; sortOrder: number }[];
    employment?: {
      _id?: unknown;
      title: string;
      period: string;
      description: string;
      sortOrder: number;
    }[];
    education?: {
      _id?: unknown;
      degree: string;
      period: string;
      details: string;
      thesisUrl?: string;
      sortOrder: number;
    }[];
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

function sortByOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export const defaultWebsiteData: PublicWebsiteData = {
  branding: {
    labName: "Your Lab Name",
    shortName: "YOUR LAB",
    siteTitle: "Your Lab Name | Research and Innovation",
    siteDescription:
      "Faculty profile site for publications, projects, teaching, students, and administration.",
    heroTitle: "Your Lab Name",
    heroSubtitle: "Research, teaching, and academic profile",
    tagline: "Building ideas into impact",
    footerText: "All rights reserved.",
    iconMimeType: "",
    iconBase64: "",
    iconUrl: "",
  },
  about: {
    title: "About Us",
    body:
      "This section introduces your lab, its mission, and the broad problems it aims to solve.\n\nUse this space to describe the vision of the lab, the major research themes, and the real-world impact of your work.",
    imageMimeType: "",
    imageBase64: "",
    imageUrl: "",
  },
  lead: {
    name: "Dr. Lead Name",
    role: "Assistant Professor (Grade-I), Civil Engineering",
    location: "Your City, India",
    phone: "+91-0000000000",
    cvUrl: "",
    bio:
      "Write a short professional introduction for the lab lead here.\n\nInclude expertise, research interests, and collaboration focus.",
    scholarUrl: "https://scholar.google.com/",
    researchGateUrl: "https://www.researchgate.net/",
    imageMimeType: "",
    imageBase64: "",
    imageUrl: "",
  },
  home: {
    aboutSummary:
      "I work in Hydraulics & Water Resources Engineering (HWRE) with interests in hydrological/hydraulic modelling, water quality assessment, river systems, and decision support tools.",
    highlights: [
      "GIZ-funded Barak River Basin Management Plan",
      "Smart Laboratory on Clean Rivers (SLCR)",
      "Climate-resilient water resource planning",
    ],
    researchInterests: [
      "Hydrological modelling (SWAT, HEC-RAS)",
      "Water quality and treatment systems",
      "River basin management and decision support",
      "Machine learning applications in water resources",
    ],
    recentProjectsLimit: 5,
    recentPublicationsLimit: 5,
    profileLinks: [
      { id: "pl1", label: "Faculty Profile", url: "https://example.edu/", sortOrder: 1 },
      { id: "pl2", label: "LinkedIn", url: "https://www.linkedin.com/", sortOrder: 2 },
      { id: "pl3", label: "Google Scholar", url: "https://scholar.google.com/", sortOrder: 3 },
    ],
    employment: [
      {
        id: "e1",
        title: "Assistant Professor",
        period: "April 2023 – Present",
        description: "Your Institution. Department of Civil Engineering.",
        sortOrder: 1,
      },
    ],
    education: [
      {
        id: "ed1",
        degree: "Ph.D.",
        period: "June 2012 – August 2018",
        details: "Hydraulics and Water Resources Engineering, Civil Engineering.",
        thesisUrl: "",
        sortOrder: 1,
      },
    ],
  },
  contact: {
    addressLine: "D Block Room No: 208\nABV-IIITM Gwalior",
    email: "asy@iiitm.ac.in",
    webUrl: "https://www.iiitm.ac.in/",
    webLinkLabel: "Click here",
    linkedInUrl: "https://www.linkedin.com/",
    linkedInLabel: "Click here",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=26.2494,78.1867&hl=en&z=16&ie=UTF8&output=embed",
  },
};

function serialize(doc: WebsiteDataRecord): PublicWebsiteData {
  const homeDefaults = defaultWebsiteData.home;
  const homeDoc = doc.home;
  const profileLinks = sortByOrder(
    (homeDoc?.profileLinks ?? []).map((link) => ({
      id: String(link._id),
      label: link.label,
      url: link.url,
      sortOrder: link.sortOrder,
    })),
  );

  const employment = sortByOrder(
    (homeDoc?.employment ?? []).map((entry) => ({
      id: String(entry._id),
      title: entry.title,
      period: entry.period,
      description: entry.description,
      sortOrder: entry.sortOrder,
    })),
  );

  const education = sortByOrder(
    (homeDoc?.education ?? []).map((entry) => ({
      id: String(entry._id),
      degree: entry.degree,
      period: entry.period,
      details: entry.details,
      thesisUrl: entry.thesisUrl || "",
      sortOrder: entry.sortOrder,
    })),
  );

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
      iconBase64: bufferToBase64(doc.branding.iconData),
      iconUrl: toImageBuffer(doc.branding.iconData).length
        ? websiteDataImageUrl("branding")
        : "",
    },
    about: {
      title: doc.about.title,
      body: doc.about.body,
      imageMimeType: doc.about.imageMimeType || "",
      imageBase64: bufferToBase64(doc.about.imageData),
      imageUrl: toImageBuffer(doc.about.imageData).length ? websiteDataImageUrl("about") : "",
    },
    lead: {
      name: doc.lead.name,
      role: doc.lead.role,
      location: doc.lead.location ?? defaultWebsiteData.lead.location,
      phone: doc.lead.phone ?? defaultWebsiteData.lead.phone,
      cvUrl: doc.lead.cvUrl ?? defaultWebsiteData.lead.cvUrl,
      bio: doc.lead.bio,
      scholarUrl: doc.lead.scholarUrl,
      researchGateUrl: doc.lead.researchGateUrl,
      imageMimeType: doc.lead.imageMimeType || "",
      imageBase64: bufferToBase64(doc.lead.imageData),
      imageUrl: toImageBuffer(doc.lead.imageData).length ? websiteDataImageUrl("lead") : "",
    },
    home: {
      aboutSummary: homeDoc?.aboutSummary ?? homeDefaults.aboutSummary,
      highlights: parseLines(homeDoc?.highlightsText ?? homeDefaults.highlights.join("\n")),
      researchInterests: parseLines(
        homeDoc?.researchInterestsText ?? homeDefaults.researchInterests.join("\n"),
      ),
      recentProjectsLimit: homeDoc?.recentProjectsLimit ?? homeDefaults.recentProjectsLimit,
      recentPublicationsLimit:
        homeDoc?.recentPublicationsLimit ?? homeDefaults.recentPublicationsLimit,
      profileLinks: profileLinks.length ? profileLinks : homeDefaults.profileLinks,
      employment: employment.length ? employment : homeDefaults.employment,
      education: education.length ? education : homeDefaults.education,
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

/** Mongoose defaults for creating a new document from admin API. */
export function websiteDataMongooseDefaults() {
  return {
    branding: {
      ...defaultWebsiteData.branding,
      iconMimeType: "",
    },
    about: { ...defaultWebsiteData.about, imageMimeType: "" },
    lead: { ...defaultWebsiteData.lead, imageMimeType: "" },
    home: {
      aboutSummary: defaultWebsiteData.home.aboutSummary,
      highlightsText: defaultWebsiteData.home.highlights.join("\n"),
      researchInterestsText: defaultWebsiteData.home.researchInterests.join("\n"),
      recentProjectsLimit: defaultWebsiteData.home.recentProjectsLimit,
      recentPublicationsLimit: defaultWebsiteData.home.recentPublicationsLimit,
      profileLinks: defaultWebsiteData.home.profileLinks.map(({ label, url, sortOrder }) => ({
        label,
        url,
        sortOrder,
      })),
      employment: defaultWebsiteData.home.employment.map(
        ({ title, period, description, sortOrder }) => ({
          title,
          period,
          description,
          sortOrder,
        }),
      ),
      education: defaultWebsiteData.home.education.map(
        ({ degree, period, details, thesisUrl, sortOrder }) => ({
          degree,
          period,
          details,
          thesisUrl,
          sortOrder,
        }),
      ),
    },
    contact: defaultWebsiteData.contact,
  };
}

export type SiteLayoutData = {
  branding: {
    headerName: string;
    iconMimeType: string;
    iconBase64: string;
  };
  labName: string;
  footerText: string;
};

export async function getWebsiteBrandingForMetadata() {
  const fallback = defaultWebsiteData.branding;
  try {
    return await dbQuery(async () => {
      const doc = await WebsiteData.findOne()
        .select(
          "branding.siteTitle branding.siteDescription branding.iconMimeType branding.iconData",
        )
        .lean();
      if (!doc) {
        return {
          siteTitle: fallback.siteTitle,
          siteDescription: fallback.siteDescription,
          iconMimeType: fallback.iconMimeType,
          iconBase64: fallback.iconBase64,
        };
      }
      return {
        siteTitle: doc.branding.siteTitle,
        siteDescription: doc.branding.siteDescription,
        iconMimeType: doc.branding.iconMimeType || "",
        iconBase64: bufferToBase64(doc.branding.iconData),
      };
    });
  } catch {
    return {
      siteTitle: fallback.siteTitle,
      siteDescription: fallback.siteDescription,
      iconMimeType: fallback.iconMimeType,
      iconBase64: fallback.iconBase64,
    };
  }
}

/** Header/footer fields only — avoids loading large about/lead images on every page. */
export async function getSiteLayoutData(): Promise<SiteLayoutData> {
  const fallback = defaultWebsiteData.branding;
  try {
    return await dbQuery(async () => {
      const doc = await WebsiteData.findOne()
        .select(
          "branding.labName branding.shortName branding.footerText branding.tagline branding.iconMimeType branding.iconData",
        )
        .lean();
      if (!doc) {
        return {
          branding: {
            headerName: fallback.labName,
            iconMimeType: fallback.iconMimeType,
            iconBase64: fallback.iconBase64,
          },
          labName: fallback.labName,
          footerText: fallback.footerText,
        };
      }
      return {
        branding: {
          headerName: doc.branding.labName,
          iconMimeType: doc.branding.iconMimeType || "",
          iconBase64: bufferToBase64(doc.branding.iconData),
        },
        labName: doc.branding.labName,
        footerText: doc.branding.footerText,
      };
    });
  } catch {
    return {
      branding: {
        headerName: fallback.labName,
        iconMimeType: fallback.iconMimeType,
        iconBase64: fallback.iconBase64,
      },
      labName: fallback.labName,
      footerText: fallback.footerText,
    };
  }
}

export async function getPublicWebsiteData() {
  try {
    return await dbQuery(async () => {
      const doc = await WebsiteData.findOne().lean();
      if (!doc) {
        return defaultWebsiteData;
      }
      return serialize(doc as WebsiteDataRecord);
    });
  } catch {
    return defaultWebsiteData;
  }
}
