import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { hashToken } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";
import { Admin } from "@/lib/models/Admin";
import { PasswordResetToken } from "@/lib/models/PasswordResetToken";

type ForgotPasswordBody = {
  email?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ForgotPasswordBody;
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }

  await connectToDb();
  const admin = await Admin.findOne({ email }).lean();

  // Always return generic success to prevent account enumeration.
  const genericResponse = NextResponse.json({
    ok: true,
    message: "If this email exists, a reset OTP was sent.",
  });

  if (!admin || !admin.isActive) {
    return genericResponse;
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const tokenHash = hashToken(otp);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await PasswordResetToken.updateMany(
    { adminId: admin._id, usedAt: null },
    { $set: { usedAt: new Date() } },
  );
  await PasswordResetToken.create({
    adminId: admin._id,
    tokenHash,
    expiresAt,
  });

  const htmlContent = `
    <p>Hello ${admin.name},</p>
    <p>You requested a password reset for your admin account.</p>
    <p>Your one-time password (OTP) is:</p>
    <p style="font-size:24px;font-weight:700;letter-spacing:4px;">${otp}</p>
    <p>
      This OTP expires in 15 minutes and can be used only once.
    </p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  await sendTransactionalEmail({
    toEmail: admin.email,
    toName: admin.name,
    subject: "Reset your TrustLab admin password",
    htmlContent,
  });

  return genericResponse;
}
