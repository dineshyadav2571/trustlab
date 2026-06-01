import { dbQuery } from "@/lib/db";
import { toImageBuffer } from "@/lib/image-buffer";
import { HomeHighlight } from "@/lib/models/HomeHighlight";

export type HomeHighlightPublic = {
  id: string;
  alt: string;
  sortOrder: number;
  imageUrl: string;
};

export function homeHighlightImageUrl(id: string) {
  return `/api/home-highlights/${id}/image`;
}

/** Admin API responses may include inline preview data. */
export type HomeHighlightAdmin = HomeHighlightPublic & {
  imageMimeType: string;
  imageBase64: string;
  createdAt: Date;
  updatedAt: Date;
};

function bufferToBase64(value: unknown) {
  const buf = toImageBuffer(value);
  if (!buf.length) return "";
  return buf.toString("base64");
}

export async function getPublicHomeHighlights(): Promise<HomeHighlightPublic[]> {
  const docs = await dbQuery(() =>
    HomeHighlight.find({}).select("_id alt sortOrder").lean(),
  );
  const sorted = [...docs].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return sorted.map((doc) => ({
    id: String(doc._id),
    alt: doc.alt ?? "",
    sortOrder: doc.sortOrder,
    imageUrl: homeHighlightImageUrl(String(doc._id)),
  }));
}

export function serializeHomeHighlightAdmin(doc: {
  _id: unknown;
  alt: string;
  sortOrder: number;
  imageData: Buffer;
  imageMimeType: string;
  createdAt: Date;
  updatedAt: Date;
}): HomeHighlightAdmin {
  const id = String(doc._id);
  return {
    id,
    alt: doc.alt,
    sortOrder: doc.sortOrder,
    imageUrl: homeHighlightImageUrl(id),
    imageMimeType: doc.imageMimeType,
    imageBase64: bufferToBase64(doc.imageData),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
