import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { serializeImportantLinkSection } from "@/lib/important-link-sections";
import {
  importantLinkIcons,
  ImportantLinkSection,
  type ImportantLinkIcon,
} from "@/lib/models/ImportantLinkSection";

type RouteContext = {
  params: Promise<{ sectionId: string; categoryId: string; linkId: string }>;
};

type UpdateLinkBody = {
  icon?: string;
  title?: string;
  url?: string;
  description?: string;
  sortOrder?: number;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function normalizeIcon(value: string): ImportantLinkIcon {
  return importantLinkIcons.includes(value as ImportantLinkIcon)
    ? (value as ImportantLinkIcon)
    : "link";
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId, categoryId, linkId } = await context.params;
  if (
    !Types.ObjectId.isValid(sectionId) ||
    !Types.ObjectId.isValid(categoryId) ||
    !Types.ObjectId.isValid(linkId)
  ) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateLinkBody;

  const section = await dbQuery(() => ImportantLinkSection.findById(sectionId));
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  const catIndex = section.categories.findIndex((c) => String(c._id) === categoryId);
  if (catIndex < 0) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const linkIndex = section.categories[catIndex].links.findIndex(
    (l) => String(l._id) === linkId,
  );
  if (linkIndex < 0) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  const link = section.categories[catIndex].links[linkIndex];
  if (typeof body.icon === "string") link.icon = normalizeIcon(body.icon.trim());
  if (typeof body.title === "string" && body.title.trim()) link.title = body.title.trim();
  if (typeof body.url === "string" && body.url.trim()) link.url = body.url.trim();
  if (typeof body.description === "string") link.description = body.description.trim();
  if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
    link.sortOrder = body.sortOrder;
  }
  section.categories[catIndex].links[linkIndex] = link;

  await section.save();
  revalidatePath("/important-links");
  return NextResponse.json({ importantLinkSection: serializeImportantLinkSection(section) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId, categoryId, linkId } = await context.params;
  if (
    !Types.ObjectId.isValid(sectionId) ||
    !Types.ObjectId.isValid(categoryId) ||
    !Types.ObjectId.isValid(linkId)
  ) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const section = await dbQuery(() => ImportantLinkSection.findById(sectionId));
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  const catIndex = section.categories.findIndex((c) => String(c._id) === categoryId);
  if (catIndex < 0) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const nextLinks = section.categories[catIndex].links.filter((l) => String(l._id) !== linkId);
  if (nextLinks.length === section.categories[catIndex].links.length) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  section.categories[catIndex].links = nextLinks;
  await section.save();
  revalidatePath("/important-links");
  return NextResponse.json({ ok: true });
}
