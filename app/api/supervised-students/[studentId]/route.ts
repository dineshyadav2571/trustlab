import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  supervisedStudentCategories,
  SupervisedStudent,
  type SupervisedStudentCategory,
} from "@/lib/models/SupervisedStudent";

type RouteContext = {
  params: Promise<{ studentId: string }>;
};

type UpdateBody = {
  category?: string;
  nameLine?: string;
  topic?: string;
  sortOrder?: number;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function isCategory(value: string): value is SupervisedStudentCategory {
  return supervisedStudentCategories.includes(value as SupervisedStudentCategory);
}

function serialize(item: {
  _id: unknown;
  category: SupervisedStudentCategory;
  nameLine: string;
  topic: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(item._id),
    category: item.category,
    nameLine: item.nameLine,
    topic: item.topic,
    sortOrder: item.sortOrder,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { studentId } = await context.params;
  if (!Types.ObjectId.isValid(studentId)) {
    return NextResponse.json({ error: "Invalid student id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateBody;

  await connectToDb();
  const student = await SupervisedStudent.findById(studentId);
  if (!student) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  if (typeof body.category === "string") {
    const nextCategory = body.category.trim();
    if (!isCategory(nextCategory)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    student.category = nextCategory;
  }

  if (typeof body.nameLine === "string" && body.nameLine.trim()) {
    student.nameLine = body.nameLine.trim();
  }

  if (typeof body.topic === "string" && body.topic.trim()) {
    student.topic = body.topic.trim();
  }

  if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
    student.sortOrder = body.sortOrder;
  }

  await student.save();
  return NextResponse.json({ supervisedStudent: serialize(student) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { studentId } = await context.params;
  if (!Types.ObjectId.isValid(studentId)) {
    return NextResponse.json({ error: "Invalid student id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await SupervisedStudent.findByIdAndDelete(studentId);
  if (!deleted) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
