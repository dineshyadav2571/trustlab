import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  supervisedStudentCategories,
  SupervisedStudent,
  type SupervisedStudentCategory,
} from "@/lib/models/SupervisedStudent";

type CreateBody = {
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

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const students = await SupervisedStudent.find({}).lean();
  const categoryOrder = new Map(
    supervisedStudentCategories.map((category, index) => [category, index]),
  );

  students.sort((a, b) => {
    const categoryDiff =
      (categoryOrder.get(a.category) ?? 0) - (categoryOrder.get(b.category) ?? 0);
    if (categoryDiff !== 0) return categoryDiff;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return NextResponse.json({ supervisedStudents: students.map(serialize) });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const body = (await request.json()) as CreateBody;
  const category = String(body.category ?? "").trim();
  const nameLine = String(body.nameLine ?? "").trim();
  const topic = String(body.topic ?? "").trim();
  const sortOrder = Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0;

  if (!isCategory(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }
  if (!nameLine || !topic) {
    return NextResponse.json(
      { error: "nameLine and topic are required." },
      { status: 400 },
    );
  }

  await connectToDb();
  const created = await SupervisedStudent.create({
    category,
    nameLine,
    topic,
    sortOrder,
  });

  return NextResponse.json({ supervisedStudent: serialize(created) }, { status: 201 });
}
