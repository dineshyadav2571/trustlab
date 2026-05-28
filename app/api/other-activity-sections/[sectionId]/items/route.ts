import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  OtherActivitySection,
  type OtherActivityListStyle,
} from "@/lib/models/OtherActivitySection";

type RouteContext = {
  params: Promise<{ sectionId: string }>;
};

type CreateItemBody = {
  text?: string;
  sortOrder?: number;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId } = await context.params;
  if (!Types.ObjectId.isValid(sectionId)) {
    return NextResponse.json({ error: "Invalid section id." }, { status: 400 });
  }

  const body = (await request.json()) as CreateItemBody;
  const text = String(body.text ?? "").trim();
  const sortOrder = Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0;

  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  await connectToDb();
  const section = await OtherActivitySection.findById(sectionId);
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  section.items.push({ text, sortOrder } as never);
  await section.save();

  return NextResponse.json(
    { otherActivitySection: serializeSection(section) },
    { status: 201 },
  );
}
