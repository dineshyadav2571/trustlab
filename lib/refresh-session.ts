import crypto from "crypto";
import { Types } from "mongoose";
import {
  getRefreshTokenMaxAgeSeconds,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { RefreshSession } from "@/lib/models/RefreshSession";

export async function createRefreshSession(adminId: string, email: string) {
  const tokenId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + getRefreshTokenMaxAgeSeconds() * 1000);

  await RefreshSession.create({
    adminId: new Types.ObjectId(adminId),
    tokenId,
    expiresAt,
  });

  const refreshToken = signRefreshToken({
    sub: adminId,
    email,
    role: "admin",
    tokenId,
  });

  return { refreshToken, tokenId, expiresAt };
}

export async function revokeRefreshSession(token: string) {
  try {
    const payload = verifyRefreshToken(token);
    await RefreshSession.updateOne(
      { tokenId: payload.tokenId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  } catch {
    // Ignore bad refresh token during logout.
  }
}
