import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  otherActivityListStyles,
  OtherActivitySection,
  type OtherActivityListStyle,
} from "@/lib/models/OtherActivitySection";

type RouteContext = {
  params: Promise<{ sectionId: string }>;
};

type UpdateSectionBody = {
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

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId } = await context.params;
  if (!Types.ObjectId.isValid(sectionId)) {
    return NextResponse.json({ error: "Invalid section id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateSectionBody;

  await connectToDb();
  const section = await OtherActivitySection.findById(sectionId);
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  if (typeof body.title === "string" && body.title.trim()) {
    section.title = body.title.trim();
  }

  if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
    section.sortOrder = body.sortOrder;
  }

  if (typeof body.listStyle === "string") {
    const next = body.listStyle.trim();
    if (isListStyle(next)) {
      section.listStyle = next;
    }
  }

  await section.save();
  return NextResponse.json({ otherActivitySection: serializeSection(section) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId } = await context.params;
  if (!Types.ObjectId.isValid(sectionId)) {
    return NextResponse.json({ error: "Invalid section id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await OtherActivitySection.findByIdAndDelete(sectionId);
  if (!deleted) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
