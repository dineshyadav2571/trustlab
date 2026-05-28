import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { defaultSupervisedStudents } from "@/lib/defaults/supervised-students";
import { SupervisedStudent } from "@/lib/models/SupervisedStudent";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/** Replace all supervised students with the bundled reference demo data. */
export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  await SupervisedStudent.deleteMany({});
  const created = await SupervisedStudent.insertMany(defaultSupervisedStudents);

  return NextResponse.json({ count: created.length });
}
