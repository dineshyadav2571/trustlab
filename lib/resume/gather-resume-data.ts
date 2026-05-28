import { dbQuery } from "@/lib/db";
import { getPublicAdministrationSections } from "@/lib/administration";
import { Achievement } from "@/lib/models/Achievement";
import { Patent } from "@/lib/models/Patent";
import { Publication, publicationCategories } from "@/lib/models/Publication";
import { ResearchProject } from "@/lib/models/ResearchProject";
import { TeachingCourse } from "@/lib/models/TeachingCourse";
import { getPublicSupervisedStudents } from "@/lib/supervised-students";
import { getPublicWebsiteData } from "@/lib/website-data";
import type { ResumeData } from "@/lib/resume/types";

const MAX_PROJECTS = 12;
const MAX_PUBLICATIONS_PER_CATEGORY = 15;

function projectLines(clgName: string, bugged: string) {
  const lines: string[] = [];
  if (clgName.trim()) {
    lines.push(clgName.includes(":") ? clgName.trim() : `Funding Agency: ${clgName.trim()}`);
  }
  for (const line of bugged.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed) lines.push(trimmed);
  }
  return lines;
}

export async function gatherResumeData(): Promise<ResumeData> {
  const website = await getPublicWebsiteData();
  const { lead, contact, home } = website;

  const profileLinks = home.profileLinks.map((l) => ({ label: l.label, url: l.url }));
  const extraLinks: { label: string; url: string }[] = [];
  if (lead.scholarUrl) extraLinks.push({ label: "Google Scholar", url: lead.scholarUrl });
  if (lead.researchGateUrl) extraLinks.push({ label: "ResearchGate", url: lead.researchGateUrl });
  if (contact.linkedInUrl) {
    extraLinks.push({
      label: contact.linkedInLabel || "LinkedIn",
      url: contact.linkedInUrl,
    });
  }
  if (contact.webUrl) {
    extraLinks.push({
      label: contact.webLinkLabel || "Website",
      url: contact.webUrl,
    });
  }

  const seen = new Set<string>();
  const links = [...profileLinks, ...extraLinks].filter((link) => {
    if (!link.label?.trim() || !link.url?.trim()) return false;
    const key = link.url.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const linksForPdf = links.map((link) => {
    let label = link.label;
    try {
      if (label.length > 48 && /^https?:\/\//i.test(link.url)) {
        label = new URL(link.url).hostname.replace(/^www\./, "");
      }
    } catch {
      // keep original label
    }
    return { ...link, label };
  });

  let projects: ResumeData["projects"] = [];
  let publications: ResumeData["publications"] = [];
  let teaching: string[] = [];
  let patents: ResumeData["patents"] = [];
  let achievements: ResumeData["achievements"] = [];

  try {
    const [projectDocs, publicationDocs, courseDocs, patentDocs, achievementDocs] =
      await dbQuery(() =>
        Promise.all([
          ResearchProject.find({}).sort({ createdAt: -1 }).limit(MAX_PROJECTS).lean(),
          Publication.find({}).sort({ createdAt: -1 }).lean(),
          TeachingCourse.find({}).sort({ createdAt: 1 }).lean(),
          Patent.find({}).sort({ createdAt: -1 }).lean(),
          Achievement.find({}).sort({ createdAt: -1 }).lean(),
        ]),
      );

    projects = projectDocs.map((p) => ({
      title: p.title,
      lines: projectLines(p.clgName, p.bugged),
    }));

    const pubsByCategory = new Map<string, { text: string; link?: string }[]>();
    for (const category of publicationCategories) {
      pubsByCategory.set(category, []);
    }
    for (const pub of publicationDocs) {
      const list = pubsByCategory.get(pub.category) ?? [];
      if (list.length < MAX_PUBLICATIONS_PER_CATEGORY) {
        list.push({
          text: pub.text,
          link: pub.link?.trim() || undefined,
        });
        pubsByCategory.set(pub.category, list);
      }
    }
    publications = publicationCategories
      .map((category) => ({
        category,
        items: pubsByCategory.get(category) ?? [],
      }))
      .filter((group) => group.items.length > 0);

    teaching = courseDocs.map((c) => c.name);

    const patentsByCategory = new Map<string, string[]>();
    for (const patent of patentDocs) {
      const list = patentsByCategory.get(patent.category) ?? [];
      list.push(patent.text);
      patentsByCategory.set(patent.category, list);
    }
    patents = [...patentsByCategory.entries()].map(([category, items]) => ({
      category,
      items,
    }));

    const achievementsByCategory = new Map<string, string[]>();
    for (const item of achievementDocs) {
      const list = achievementsByCategory.get(item.category) ?? [];
      list.push(item.text);
      achievementsByCategory.set(item.category, list);
    }
    achievements = [...achievementsByCategory.entries()].map(([category, items]) => ({
      category,
      items,
    }));
  } catch {
    // partial resume from website data only
  }

  let students: ResumeData["students"] = [];
  let administration: ResumeData["administration"] = [];

  try {
    const studentDocs = await getPublicSupervisedStudents();
    const byCategory = new Map<string, { nameLine: string; topic: string }[]>();
    for (const student of studentDocs) {
      const list = byCategory.get(student.category) ?? [];
      list.push({ nameLine: student.nameLine, topic: student.topic });
      byCategory.set(student.category, list);
    }
    students = [...byCategory.entries()].map(([category, entries]) => ({
      category,
      entries,
    }));
  } catch {
    students = [];
  }

  try {
    const adminSections = await getPublicAdministrationSections();
    administration = adminSections.map((section) => ({
      title: section.title,
      items: section.items.map((item) => item.text),
    }));
  } catch {
    administration = [];
  }

  return {
    lead: {
      name: lead.name,
      role: lead.role,
      location: lead.location,
      phone: lead.phone,
      imageMimeType: lead.imageMimeType,
      imageBase64: lead.imageBase64,
    },
    contact: {
      email: contact.email,
      webUrl: contact.webUrl,
      webLinkLabel: contact.webLinkLabel,
      linkedInUrl: contact.linkedInUrl,
      linkedInLabel: contact.linkedInLabel,
    },
    links: linksForPdf,
    aboutSummary: home.aboutSummary,
    researchInterests: home.researchInterests,
    highlights: home.highlights,
    education: home.education.map((e) => ({
      title: e.degree,
      period: e.period,
      description: e.details,
      thesisUrl: e.thesisUrl || undefined,
    })),
    employment: home.employment.map((e) => ({
      title: e.title,
      period: e.period,
      description: e.description,
    })),
    projects,
    publications,
    teaching,
    students,
    administration,
    patents,
    achievements,
  };
}

export function resumePdfFilename(name: string) {
  const slug = name
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80);
  return `${slug || "Resume"}_Resume.pdf`;
}
