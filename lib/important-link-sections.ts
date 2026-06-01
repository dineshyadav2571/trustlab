import { dbQuery } from "@/lib/db";
import { defaultImportantLinkSections } from "@/lib/defaults/important-links";
import {
  normalizeImportantLinkIcon,
  type ImportantLinkIcon,
  type ImportantLinkLayout,
} from "@/lib/important-link-types";
import { ImportantLinkSection } from "@/lib/models/ImportantLinkSection";

export type ImportantLinkItemPublic = {
  id: string;
  icon: ImportantLinkIcon;
  title: string;
  url: string;
  description: string;
  sortOrder: number;
};

export type ImportantLinkCategoryPublic = {
  id: string;
  title: string;
  sortOrder: number;
  links: ImportantLinkItemPublic[];
};

export type ImportantLinkSectionPublic = {
  id: string;
  title: string;
  intro: string;
  layout: ImportantLinkLayout;
  sortOrder: number;
  categories: ImportantLinkCategoryPublic[];
};

type SectionDoc = {
  _id: unknown;
  title: string;
  intro: string;
  layout: ImportantLinkLayout;
  sortOrder: number;
  categories: {
    _id: unknown;
    title: string;
    sortOrder: number;
    links: {
      _id: unknown;
      icon: string;
      title: string;
      url: string;
      description: string;
      sortOrder: number;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export function serializeImportantLinkSection(doc: SectionDoc) {
  const categories = [...doc.categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => {
      const links = [...category.links]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((link) => ({
          id: String(link._id),
          icon: normalizeImportantLinkIcon(link.icon),
          title: link.title,
          url: link.url,
          description: link.description,
          sortOrder: link.sortOrder,
        }));
      return {
        id: String(category._id),
        title: category.title,
        sortOrder: category.sortOrder,
        links,
      };
    });

  return {
    id: String(doc._id),
    title: doc.title,
    intro: doc.intro,
    layout: doc.layout,
    sortOrder: doc.sortOrder,
    categories,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function ensureImportantLinksSeeded() {
  await dbQuery(async () => {
    const count = await ImportantLinkSection.countDocuments();
    if (count > 0) return;
    await ImportantLinkSection.insertMany(defaultImportantLinkSections);
  });
}

export async function getPublicImportantLinkSections(): Promise<ImportantLinkSectionPublic[]> {
  await ensureImportantLinksSeeded();

  const docs = await dbQuery(() => ImportantLinkSection.find({}).lean());
  const sorted = [...docs].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return sorted.map((doc) => {
    const serialized = serializeImportantLinkSection(doc as SectionDoc);
    const { createdAt: _c, updatedAt: _u, ...rest } = serialized;
    return rest;
  });
}
