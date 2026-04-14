import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateUserRequest } from "@/lib/auth-guard";
import { AppUser } from "@/lib/models/AppUser";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const auth = authenticateUserRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDb();
  const user = await AppUser.findById(auth.sub).lean();
  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
  });
}
