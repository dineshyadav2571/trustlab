import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { serializeImportantLinkSection } from "@/lib/important-link-sections";
import { ImportantLinkSection } from "@/lib/models/ImportantLinkSection";

type RouteContext = { params: Promise<{ sectionId: string }> };

type CreateCategoryBody = { title?: string; sortOrder?: number };

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  const body = (await request.json()) as CreateCategoryBody;
  const title = String(body.title ?? "").trim();
  const sortOrder = Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0;

  const section = await dbQuery(() => ImportantLinkSection.findById(sectionId));
  if (!section) {
    return NextResponse.json({ error: "Section not found." }, { status: 404 });
  }

  section.categories.push({ title, sortOrder, links: [] } as never);
  await section.save();

  revalidatePath("/important-links");
  return NextResponse.json(
    { importantLinkSection: serializeImportantLinkSection(section) },
    { status: 201 },
  );
}
