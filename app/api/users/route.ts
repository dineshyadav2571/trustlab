import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { hashPassword } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { AppUser } from "@/lib/models/AppUser";

type CreateUserBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectToDb();
  const users = await AppUser.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });

  return NextResponse.json({
    users: users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      createdAt: u.createdAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as CreateUserBody;
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!name || !email || password.length < 8) {
    return NextResponse.json(
      { error: "Name, email and password (min 8 chars) are required." },
      { status: 400 },
    );
  }

  await connectToDb();
  const existing = await AppUser.findOne({ email }).lean();

  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const created = await AppUser.create({
    name,
    email,
    passwordHash,
    isActive: true,
  });

  let emailSent = true;
  try {
    const loginUrl = `${env.appBaseUrl}/user/login`;
    const resetUrl = `${env.appBaseUrl}/user/forgot-password`;
    const htmlContent = `
      <p>Hello ${created.name},</p>
      <p>Your TrustLab user account has been created.</p>
      <p>Here are your login details:</p>
      <ul>
        <li><strong>Name:</strong> ${created.name}</li>
        <li><strong>Email:</strong> ${created.email}</li>
        <li><strong>Temporary Password:</strong> ${password}</li>
      </ul>
      <p>Sign in here: <a href="${loginUrl}" target="_blank" rel="noreferrer">${loginUrl}</a></p>
      <p>If you forget your password, you can reset it here: <a href="${resetUrl}" target="_blank" rel="noreferrer">${resetUrl}</a></p>
      <p>Please change your password after first sign-in when that option is available.</p>
    `;

    await sendTransactionalEmail({
      toEmail: created.email,
      toName: created.name,
      subject: "Your TrustLab user account details",
      htmlContent,
    });
  } catch {
    emailSent = false;
  }

  return NextResponse.json(
    {
      user: {
        id: String(created._id),
        name: created.name,
        email: created.email,
        isActive: created.isActive,
        createdAt: created.createdAt,
      },
      emailSent,
    },
    { status: 201 },
  );
}
