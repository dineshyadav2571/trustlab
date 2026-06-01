import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { defaultImportantLinkSections } from "@/lib/defaults/important-links";
import { ImportantLinkSection } from "@/lib/models/ImportantLinkSection";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const created = await dbQuery(async () => {
    await ImportantLinkSection.deleteMany({});
    return ImportantLinkSection.insertMany(defaultImportantLinkSections);
  });

  revalidatePath("/important-links");
  return NextResponse.json({ count: created.length });
}
