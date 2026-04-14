import crypto from "crypto";
import { Types } from "mongoose";
import {
  getRefreshTokenMaxAgeSeconds,
  signRefreshToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { UserRefreshSession } from "@/lib/models/UserRefreshSession";

export async function createUserRefreshSession(userId: string, email: string) {
  const tokenId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + getRefreshTokenMaxAgeSeconds() * 1000);

  await UserRefreshSession.create({
    userId: new Types.ObjectId(userId),
    tokenId,
    expiresAt,
  });

  const refreshToken = signRefreshToken({
    sub: userId,
    email,
    role: "user",
    tokenId,
  });

  return { refreshToken, tokenId, expiresAt };
}

export async function revokeUserRefreshSession(tokenId: string) {
  await UserRefreshSession.updateOne(
    { tokenId, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}

export async function revokeAllUserRefreshSessions(userId: string) {
  await UserRefreshSession.updateMany(
    { userId: new Types.ObjectId(userId), revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}

export async function revokeUserRefreshSessionFromToken(token: string) {
  try {
    const payload = verifyRefreshToken(token);
    if (payload.role !== "user") {
      return;
    }
    await revokeUserRefreshSession(payload.tokenId);
  } catch {
    // Ignore bad refresh token during logout.
  }
}
