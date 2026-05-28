import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { defaultOtherActivitySections } from "@/lib/defaults/other-activities";
import { OtherActivitySection } from "@/lib/models/OtherActivitySection";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  await OtherActivitySection.deleteMany({});
  const created = await OtherActivitySection.insertMany(defaultOtherActivitySections);

  return NextResponse.json({ count: created.length });
}
