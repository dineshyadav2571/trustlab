import { dbQuery } from "@/lib/db";
import { defaultOtherActivitySections } from "@/lib/defaults/other-activities";
import {
  OtherActivitySection,
  type OtherActivityListStyle,
} from "@/lib/models/OtherActivitySection";

export type OtherActivityItemPublic = {
  id: string;
  text: string;
  sortOrder: number;
};

export type OtherActivitySectionPublic = {
  id: string;
  title: string;
  sortOrder: number;
  listStyle: OtherActivityListStyle;
  items: OtherActivityItemPublic[];
};

export async function ensureOtherActivitiesSeeded() {
  await dbQuery(async () => {
    const count = await OtherActivitySection.countDocuments();
    if (count > 0) return;
    await OtherActivitySection.insertMany(defaultOtherActivitySections);
  });
}

export async function getPublicOtherActivitySections(): Promise<OtherActivitySectionPublic[]> {
  await ensureOtherActivitiesSeeded();

  const docs = await dbQuery(() => OtherActivitySection.find({}).lean());
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
      listStyle: doc.listStyle,
      items: items.map((item) => ({
        id: String(item._id),
        text: item.text,
        sortOrder: item.sortOrder,
      })),
    };
  });
}
