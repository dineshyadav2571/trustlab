import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { hashToken } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";
import { AppUser } from "@/lib/models/AppUser";
import { UserPasswordResetToken } from "@/lib/models/UserPasswordResetToken";

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
  const user = await AppUser.findOne({ email }).lean();

  const genericResponse = NextResponse.json({
    ok: true,
    message: "If this email exists, a reset OTP was sent.",
  });

  if (!user || !user.isActive) {
    return genericResponse;
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const tokenHash = hashToken(otp);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await UserPasswordResetToken.updateMany(
    { userId: user._id, usedAt: null },
    { $set: { usedAt: new Date() } },
  );
  await UserPasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  const htmlContent = `
    <p>Hello ${user.name},</p>
    <p>You requested a password reset for your TrustLab user account.</p>
    <p>Your one-time password (OTP) is:</p>
    <p style="font-size:24px;font-weight:700;letter-spacing:4px;">${otp}</p>
    <p>
      This OTP expires in 15 minutes and can be used only once.
    </p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  await sendTransactionalEmail({
    toEmail: user.email,
    toName: user.name,
    subject: "Reset your TrustLab user password",
    htmlContent,
  });

  return genericResponse;
}
