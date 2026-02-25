import crypto from "crypto";
import { prisma } from "./prisma";
import { env } from "./env";

export function hashToken(token: string) {
  const secret = env.SESSION_SECRET;
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
}

export async function getSessionFromToken(rawToken?: string | null) {
  if (!rawToken) return null;

  const tokenHash = hashToken(rawToken);

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt <= new Date()) return null;

  return session;
}