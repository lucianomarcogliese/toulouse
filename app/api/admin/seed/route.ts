import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function POST() {
  if (env.NODE_ENV === "production") {
    return Response.json({ ok: false, error: "No disponible" }, { status: 404 });
  }
  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_PASSWORD;

  if (!email || !password) {
    return Response.json(
      { ok: false, error: "Faltan ADMIN_EMAIL o ADMIN_PASSWORD en .env.local" },
      { status: 500 }
    );
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ ok: true, message: "Admin ya existe" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.create({
    data: { email, passwordHash },
  });

  return Response.json({ ok: true, message: "Admin creado" });
}