import { connectToDb } from "@/lib/db";
import { WebsiteData } from "@/lib/models/WebsiteData";

export type PublicWebsiteData = {
  branding: {
    labName: string;
    shortName: string;
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
    labName: "BTrust Lab @ IIITM Gwalior",
    shortName: "BTrust LAB",
    heroTitle: "BTrust Lab @ IIITM Gwalior",
    heroSubtitle: "( Blockchain Technology Lab )",
    tagline: "Securing the Data",
    footerText: "IIITM Gwalior. All rights reserved.",
    iconMimeType: "",
    iconBase64: "",
  },
  about: {
    title: "About Us",
    body:
      "The BTrust Lab (Blockchain Technology Lab) is integral to the dynamic academic community at the Indian Institute of Information Technology and Management Gwalior (IIITM). Its mission is to conduct innovative research in information security, decision systems, Internet of Vehicles (IoV), Internet of Things (IoT), electric vehicles, electronic healthcare records (EHR), and real estate. The ultimate goal of this research is to address complex problems within various social welfare contexts.\n\nWith the rapid advancement of technology in areas such as the Internet of Things (IoT), big data, communications, computing, crowd sensing, and social networking, vast amounts of data are being generated, presenting opportunities for discovery. To address challenges related to this data's size, speed, diversity, and complexity, our study aims to understand and analyse it to extract precise and actionable insights.\n\nOur team, consisting of seasoned experts and dynamic young scholars, is dedicated to advancing the frontiers of security. Every project we embark on is fueled by a deep passion for knowledge and a commitment to crafting cutting-edge solutions. We are committed to nurturing the BTrust Lab's collaborative and inclusive research culture.",
    imageMimeType: "",
    imageBase64: "",
  },
  lead: {
    name: "Dr. Amrendra Singh Yadav",
    role: "Assistant Professor, Department of Computer Science and Engineering (CSE), IIITM Gwalior",
    bio:
      "Dr. Amrendra Singh Yadav is an Assistant Professor in the Department of Computer Science and Engineering at the Indian Institute of Information Technology and Management (IIITM) Gwalior. His research spans blockchain systems, the Internet of Things (IoT), information security, and distributed applications for smart infrastructure, vehicular networks, and trustworthy data management.\n\nHe actively contributes to the BTrust Lab's mission by investigating secure and efficient protocols, consensus and sharding strategies, and real-world deployments that bridge academic research with societal impact. His work is reflected in peer-reviewed publications and ongoing collaborations with students and researchers across security and systems.\n\nHe is committed to mentoring scholars, strengthening the lab's collaborative culture, and advancing practical solutions at the intersection of blockchain, networking, and applied security.",
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
