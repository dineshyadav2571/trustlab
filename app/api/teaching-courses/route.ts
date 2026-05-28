import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { TeachingCourse } from "@/lib/models/TeachingCourse";

type CreateTeachingCourseBody = {
  name?: string;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function serialize(item: {
  _id: unknown;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(item._id),
    name: item.name,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const courses = await TeachingCourse.find({}).sort({ createdAt: 1 }).lean();
  return NextResponse.json({ teachingCourses: courses.map(serialize) });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const body = (await request.json()) as CreateTeachingCourseBody;
  const name = String(body.name ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "name is required." }, { status: 400 });
  }

  await connectToDb();
  const created = await TeachingCourse.create({ name });

  return NextResponse.json({ teachingCourse: serialize(created) }, { status: 201 });
}
