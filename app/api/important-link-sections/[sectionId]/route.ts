import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { serializeImportantLinkSection } from "@/lib/important-link-sections";
import {
  importantLinkLayouts,
  ImportantLinkSection,
  type ImportantLinkLayout,
} from "@/lib/models/ImportantLinkSection";

type RouteContext = { params: Promise<{ sectionId: string }> };

type UpdateSectionBody = {
  title?: string;
  intro?: string;
  layout?: string;
  sortOrder?: number;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function isLayout(value: string): value is ImportantLinkLayout {
  return importantLinkLayouts.includes(value as ImportantLinkLayout);
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

  const section = await dbQuery(() => ImportantLinkSection.findById(sectionId));
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  if (typeof body.title === "string" && body.title.trim()) {
    section.title = body.title.trim();
  }
  if (typeof body.intro === "string") {
    section.intro = body.intro.trim();
  }
  if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
    section.sortOrder = body.sortOrder;
  }
  if (typeof body.layout === "string") {
    const next = body.layout.trim();
    if (isLayout(next)) section.layout = next;
  }

  await section.save();
  revalidatePath("/important-links");
  return NextResponse.json({ importantLinkSection: serializeImportantLinkSection(section) });
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

  const deleted = await dbQuery(() => ImportantLinkSection.findByIdAndDelete(sectionId));
  if (!deleted) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  revalidatePath("/important-links");
  return NextResponse.json({ ok: true });
}
