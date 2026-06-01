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

type RouteContext = { params: Promise<{ sectionId: string; categoryId: string }> };

type CreateLinkBody = {
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

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { sectionId, categoryId } = await context.params;
  if (!Types.ObjectId.isValid(sectionId) || !Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const body = (await request.json()) as CreateLinkBody;
  const title = String(body.title ?? "").trim();
  const url = String(body.url ?? "").trim();
  const description = String(body.description ?? "").trim();
  const sortOrder = Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0;
  const icon = normalizeIcon(String(body.icon ?? "link").trim());

  if (!title || !url) {
    return NextResponse.json({ error: "title and url are required." }, { status: 400 });
  }

  const section = await dbQuery(() => ImportantLinkSection.findById(sectionId));
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  const catIndex = section.categories.findIndex((c) => String(c._id) === categoryId);
  if (catIndex < 0) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  section.categories[catIndex].links.push({
    icon,
    title,
    url,
    description,
    sortOrder,
  } as never);
  await section.save();

  revalidatePath("/important-links");
  return NextResponse.json(
    { importantLinkSection: serializeImportantLinkSection(section) },
    { status: 201 },
  );
}
