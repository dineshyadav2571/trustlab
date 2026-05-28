import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { AdministrationSection } from "@/lib/models/AdministrationSection";

type RouteContext = {
  params: Promise<{ sectionId: string; itemId: string }>;
};

type UpdateItemBody = {
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

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId, itemId } = await context.params;
  if (!Types.ObjectId.isValid(sectionId) || !Types.ObjectId.isValid(itemId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateItemBody;

  await connectToDb();
  const section = await AdministrationSection.findById(sectionId);
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  const itemIndex = section.items.findIndex((entry) => String(entry._id) === itemId);
  if (itemIndex < 0) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  const item = section.items[itemIndex];
  if (typeof body.text === "string" && body.text.trim()) {
    item.text = body.text.trim();
  }

  if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
    item.sortOrder = body.sortOrder;
  }
  section.items[itemIndex] = item;

  await section.save();
  return NextResponse.json({ administrationSection: serializeSection(section) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId, itemId } = await context.params;
  if (!Types.ObjectId.isValid(sectionId) || !Types.ObjectId.isValid(itemId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const section = await AdministrationSection.findById(sectionId);
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  const nextItems = section.items.filter((entry) => String(entry._id) !== itemId);
  if (nextItems.length === section.items.length) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  section.items = nextItems;
  await section.save();

  return NextResponse.json({ ok: true });
}
