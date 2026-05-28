import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  otherActivityListStyles,
  OtherActivitySection,
  type OtherActivityListStyle,
} from "@/lib/models/OtherActivitySection";

type CreateSectionBody = {
  title?: string;
  sortOrder?: number;
  listStyle?: string;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function isListStyle(value: string): value is OtherActivityListStyle {
  return otherActivityListStyles.includes(value as OtherActivityListStyle);
}

function serializeSection(doc: {
  _id: unknown;
  title: string;
  sortOrder: number;
  listStyle: OtherActivityListStyle;
  items: { _id: unknown; text: string; sortOrder: number }[];
  createdAt: Date;
  updatedAt: Date;
}) {
  const items = [...doc.items].sort((a, b) => a.sortOrder - b.sortOrder);
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
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const sections = await dbQuery(async () => {
    const docs = await OtherActivitySection.find({}).lean();
    docs.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    return docs;
  });

  return NextResponse.json({
    otherActivitySections: sections.map(serializeSection),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const body = (await request.json()) as CreateSectionBody;
  const title = String(body.title ?? "").trim();
  const sortOrder = Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0;
  const listStyleRaw = String(body.listStyle ?? "default").trim();
  const listStyle = isListStyle(listStyleRaw) ? listStyleRaw : "default";

  if (!title) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
  }

  const created = await dbQuery(() =>
    OtherActivitySection.create({
      title,
      sortOrder,
      listStyle,
      items: [],
    }),
  );

  return NextResponse.json(
    { otherActivitySection: serializeSection(created) },
    { status: 201 },
  );
}
