import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { AppUser } from "@/lib/models/AppUser";
import { UserPasswordResetToken } from "@/lib/models/UserPasswordResetToken";

type RouteContext = {
  params: Promise<{ userId: string }>;
};

type UpdateUserBody = {
  isActive?: boolean;
};

function unauthorized() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return unauthorized();
  }

  const { userId } = await context.params;
  if (!Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateUserBody;
  if (typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "isActive must be boolean." }, { status: 400 });
  }

  await connectToDb();
  const target = await AppUser.findById(userId);
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  target.isActive = body.isActive;
  await target.save();

  if (!target.isActive) {
    await UserPasswordResetToken.updateMany(
      { userId: target._id, usedAt: null },
      { $set: { usedAt: new Date() } },
    );
  }

  return NextResponse.json({
    user: {
      id: String(target._id),
      name: target.name,
      email: target.email,
      isActive: target.isActive,
      createdAt: target.createdAt,
    },
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return unauthorized();
  }

  const { userId } = await context.params;
  if (!Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  await connectToDb();
  const target = await AppUser.findById(userId);
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  await UserPasswordResetToken.deleteMany({ userId: target._id });
  await AppUser.deleteOne({ _id: target._id });

  return NextResponse.json({ ok: true });
}
