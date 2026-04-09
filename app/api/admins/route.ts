import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { hashPassword } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { Admin } from "@/lib/models/Admin";

type CreateAdminBody = {
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
  const admins = await Admin.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });

  return NextResponse.json({
    admins: admins.map((admin) => ({
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as CreateAdminBody;
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
  const existing = await Admin.findOne({ email }).lean();

  if (existing) {
    return NextResponse.json(
      { error: "An admin with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const created = await Admin.create({
    name,
    email,
    passwordHash,
    isActive: true,
  });

  let emailSent = true;
  try {
    const loginUrl = `${env.appBaseUrl}/admin/login`;
    const htmlContent = `
      <p>Hello ${created.name},</p>
      <p>Your TrustLab admin account has been created.</p>
      <p>Here are your login details:</p>
      <ul>
        <li><strong>Name:</strong> ${created.name}</li>
        <li><strong>Email:</strong> ${created.email}</li>
        <li><strong>Temporary Password:</strong> ${password}</li>
      </ul>
      <p>Login here: <a href="${loginUrl}" target="_blank" rel="noreferrer">${loginUrl}</a></p>
      <p>Please change your password after first login.</p>
    `;

    await sendTransactionalEmail({
      toEmail: created.email,
      toName: created.name,
      subject: "Your TrustLab admin account details",
      htmlContent,
    });
  } catch {
    emailSent = false;
  }

  return NextResponse.json(
    {
      admin: {
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
