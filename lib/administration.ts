import { dbQuery } from "@/lib/db";
import { defaultAdministrationSections } from "@/lib/defaults/administration-sections";
import { AdministrationSection } from "@/lib/models/AdministrationSection";

export type AdministrationItemPublic = {
  id: string;
  text: string;
  sortOrder: number;
};

export type AdministrationSectionPublic = {
  id: string;
  title: string;
  sortOrder: number;
  items: AdministrationItemPublic[];
};

export async function ensureAdministrationSeeded() {
  await dbQuery(async () => {
    const count = await AdministrationSection.countDocuments();
    if (count > 0) return;
    await AdministrationSection.insertMany(defaultAdministrationSections);
  });
}

export async function getPublicAdministrationSections(): Promise<AdministrationSectionPublic[]> {
  await ensureAdministrationSeeded();

  const docs = await dbQuery(() => AdministrationSection.find({}).lean());
  const sorted = [...docs].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return sorted.map((doc) => {
    const items = [...doc.items].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return String(a._id).localeCompare(String(b._id));
    });

    return {
      id: String(doc._id),
      title: doc.title,
      sortOrder: doc.sortOrder,
      items: items.map((item) => ({
        id: String(item._id),
        text: item.text,
        sortOrder: item.sortOrder,
      })),
    };
  });
}
