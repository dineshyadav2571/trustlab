import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { clearAuthCookies, hashPassword, hashToken } from "@/lib/auth";
import { Admin } from "@/lib/models/Admin";
import { PasswordResetToken } from "@/lib/models/PasswordResetToken";
import { RefreshSession } from "@/lib/models/RefreshSession";

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
  const admin = await Admin.findOne({ email });
  if (!admin || !admin.isActive) {
    return NextResponse.json(
      { error: "Invalid or expired OTP." },
      { status: 400 },
    );
  }

  const tokenHash = hashToken(otp);
  const resetDoc = await PasswordResetToken.findOne({
    adminId: admin._id,
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

  admin.passwordHash = await hashPassword(newPassword);
  await admin.save();

  resetDoc.usedAt = new Date();
  await resetDoc.save();

  await PasswordResetToken.updateMany(
    { adminId: admin._id, usedAt: null },
    { $set: { usedAt: new Date() } },
  );
  await RefreshSession.updateMany(
    { adminId: admin._id, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );

  const response = NextResponse.json({
    ok: true,
    message: "Password reset successful. Please login.",
  });
  clearAuthCookies(response);
  return response;
}
