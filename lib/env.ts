const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  mongodbUri: process.env.MONGODB_URI as string,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  adminAccessCookieName: process.env.ADMIN_ACCESS_COOKIE_NAME ?? "admin_access",
  adminRefreshCookieName:
    process.env.ADMIN_REFRESH_COOKIE_NAME ?? "admin_refresh",
  appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:3000",
  brevoApiKey: process.env.BREVO_API_KEY ?? "",
  brevoSenderEmail: process.env.BREVO_SENDER_EMAIL ?? "",
  brevoSenderName: process.env.BREVO_SENDER_NAME ?? "TrustLab",
  seedAdminName: process.env.SEED_ADMIN_NAME ?? "",
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL ?? "",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD ?? "",
};
