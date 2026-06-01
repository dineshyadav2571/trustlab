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

type CreateSectionBody = {
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

function revalidateImportantLinks() {
  revalidatePath("/important-links");
}

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const sections = await dbQuery(async () => {
    const docs = await ImportantLinkSection.find({}).lean();
    docs.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    return docs;
  });

  return NextResponse.json({
    importantLinkSections: sections.map((doc) => serializeImportantLinkSection(doc)),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const body = (await request.json()) as CreateSectionBody;
  const title = String(body.title ?? "").trim();
  const intro = String(body.intro ?? "").trim();
  const sortOrder = Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0;
  const layoutRaw = String(body.layout ?? "grouped").trim();
  const layout = isLayout(layoutRaw) ? layoutRaw : "grouped";

  if (!title) {
    return NextResponse.json({ error: "title is required." }, { status: 400 });
  }

  const created = await dbQuery(() =>
    ImportantLinkSection.create({
      title,
      intro,
      layout,
      sortOrder,
      categories: [],
    }),
  );

  revalidateImportantLinks();
  return NextResponse.json(
    { importantLinkSection: serializeImportantLinkSection(created) },
    { status: 201 },
  );
}
