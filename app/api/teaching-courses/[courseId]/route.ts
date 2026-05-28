import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { TeachingCourse } from "@/lib/models/TeachingCourse";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

type UpdateTeachingCourseBody = {
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

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { courseId } = await context.params;
  if (!Types.ObjectId.isValid(courseId)) {
    return NextResponse.json({ error: "Invalid course id." }, { status: 400 });
  }

  await connectToDb();
  const course = await TeachingCourse.findById(courseId).lean();
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  return NextResponse.json({ teachingCourse: serialize(course) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { courseId } = await context.params;
  if (!Types.ObjectId.isValid(courseId)) {
    return NextResponse.json({ error: "Invalid course id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateTeachingCourseBody;

  await connectToDb();
  const course = await TeachingCourse.findById(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  if (typeof body.name === "string" && body.name.trim()) {
    course.name = body.name.trim();
  }

  await course.save();
  return NextResponse.json({ teachingCourse: serialize(course) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { courseId } = await context.params;
  if (!Types.ObjectId.isValid(courseId)) {
    return NextResponse.json({ error: "Invalid course id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await TeachingCourse.findByIdAndDelete(courseId);
  if (!deleted) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
