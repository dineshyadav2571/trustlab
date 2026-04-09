import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { Opportunity } from "@/lib/models/Opportunity";

type RouteContext = {
  params: Promise<{ opportunityId: string }>;
};

type UpdateBody = {
  text?: string;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function serialize(item: {
  _id: unknown;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(item._id),
    text: item.text,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { opportunityId } = await context.params;
  if (!Types.ObjectId.isValid(opportunityId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const item = await Opportunity.findById(opportunityId).lean();
  if (!item) {
    return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
  }

  return NextResponse.json({ opportunity: serialize(item) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { opportunityId } = await context.params;
  if (!Types.ObjectId.isValid(opportunityId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateBody;

  await connectToDb();
  const item = await Opportunity.findById(opportunityId);
  if (!item) {
    return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
  }

  if (typeof body.text === "string" && body.text.trim()) {
    item.text = body.text.trim();
  }

  await item.save();
  return NextResponse.json({ opportunity: serialize(item) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { opportunityId } = await context.params;
  if (!Types.ObjectId.isValid(opportunityId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await Opportunity.findByIdAndDelete(opportunityId);
  if (!deleted) {
    return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
