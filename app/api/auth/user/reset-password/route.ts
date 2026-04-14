import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { hashPassword, hashToken } from "@/lib/auth";
import { AppUser } from "@/lib/models/AppUser";
import { UserPasswordResetToken } from "@/lib/models/UserPasswordResetToken";

type ResetPasswordBody = {
  email?: string;
  otp?: string;
  newPassword?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ResetPasswordBody;
  const email = body.email?.trim().toLowerCase();
  const otp = body.otp?.trim();
  const newPassword = body.newPassword ?? "";

  if (!email || !otp || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Email, OTP and new password (min 8 chars) are required." },
      { status: 400 },
    );
  }

  await connectToDb();
  const user = await AppUser.findOne({ email });
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: "Invalid or expired OTP." },
      { status: 400 },
    );
  }

  const tokenHash = hashToken(otp);
  const resetDoc = await UserPasswordResetToken.findOne({
    userId: user._id,
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!resetDoc) {
    return NextResponse.json(
      { error: "Invalid or expired OTP." },
      { status: 400 },
    );
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  resetDoc.usedAt = new Date();
  await resetDoc.save();

  await UserPasswordResetToken.updateMany(
    { userId: user._id, usedAt: null },
    { $set: { usedAt: new Date() } },
  );

  return NextResponse.json({
    ok: true,
    message: "Password reset successful. You can sign in with your new password.",
  });
}
