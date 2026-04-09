import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { Opportunity } from "@/lib/models/Opportunity";

type CreateBody = {
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

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const items = await Opportunity.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ opportunities: items.map(serialize) });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const body = (await request.json()) as CreateBody;
  const text = String(body.text ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  await connectToDb();
  const created = await Opportunity.create({ text });
  return NextResponse.json({ opportunity: serialize(created) }, { status: 201 });
}
