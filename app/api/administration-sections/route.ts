import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { AdministrationSection } from "@/lib/models/AdministrationSection";

type CreateSectionBody = {
  title?: string;
  sortOrder?: number;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function serializeSection(doc: {
  _id: unknown;
  title: string;
  sortOrder: number;
  items: { _id: unknown; text: string; sortOrder: number }[];
  createdAt: Date;
  updatedAt: Date;
}) {
  const items = [...doc.items].sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    id: String(doc._id),
    title: doc.title,
    sortOrder: doc.sortOrder,
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

  await connectToDb();
  const sections = await AdministrationSection.find({}).lean();
  sections.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return NextResponse.json({
    administrationSections: sections.map(serializeSection),
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

  if (!title) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
  }

  await connectToDb();
  const created = await AdministrationSection.create({
    title,
    sortOrder,
    items: [],
  });

  return NextResponse.json(
    { administrationSection: serializeSection(created) },
    { status: 201 },
  );
}
