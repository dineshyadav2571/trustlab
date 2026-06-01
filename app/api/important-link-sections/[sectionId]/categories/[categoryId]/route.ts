import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { serializeImportantLinkSection } from "@/lib/important-link-sections";
import { ImportantLinkSection } from "@/lib/models/ImportantLinkSection";

type RouteContext = { params: Promise<{ sectionId: string; categoryId: string }> };

type UpdateCategoryBody = { title?: string; sortOrder?: number };

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId, categoryId } = await context.params;
  if (!Types.ObjectId.isValid(sectionId) || !Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateCategoryBody;

  const section = await dbQuery(() => ImportantLinkSection.findById(sectionId));
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  const index = section.categories.findIndex((c) => String(c._id) === categoryId);
  if (index < 0) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const category = section.categories[index];
  if (typeof body.title === "string") category.title = body.title.trim();
  if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
    category.sortOrder = body.sortOrder;
  }
  section.categories[index] = category;

  await section.save();
  revalidatePath("/important-links");
  return NextResponse.json({ importantLinkSection: serializeImportantLinkSection(section) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId, categoryId } = await context.params;
  if (!Types.ObjectId.isValid(sectionId) || !Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const section = await dbQuery(() => ImportantLinkSection.findById(sectionId));
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  const next = section.categories.filter((c) => String(c._id) !== categoryId);
  if (next.length === section.categories.length) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  section.categories = next;
  await section.save();
  revalidatePath("/important-links");
  return NextResponse.json({ ok: true });
}
