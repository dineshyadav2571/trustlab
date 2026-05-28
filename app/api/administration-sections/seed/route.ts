import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { defaultAdministrationSections } from "@/lib/defaults/administration-sections";
import { AdministrationSection } from "@/lib/models/AdministrationSection";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  await AdministrationSection.deleteMany({});
  const created = await AdministrationSection.insertMany(defaultAdministrationSections);

  return NextResponse.json({ count: created.length });
}
