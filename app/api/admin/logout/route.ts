import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import { env } from "@/lib/env";

export const runtime = "nodejs";

/**
 * Logout: lee cookie, borra sesión en DB (invalidar token), borra cookie.
 * Así no se puede volver a usar la misma cookie.
 */
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value ?? null;

  if (token) {
    const tokenHash = hashToken(token);
    await prisma.adminSession.deleteMany({ where: { tokenHash } });
  }

  cookieStore.set("admin_session", "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return Response.json({ ok: true });
}