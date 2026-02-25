import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { getClientIp, checkLoginRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

function hashToken(token: string) {
  const secret = env.SESSION_SECRET;
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
}

async function readCredentials(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";

  // Form submit
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    return {
      email: String(fd.get("email") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
    };
  }

  // JSON
  const body = await req.json().catch(() => ({}));
  return {
    email: String((body as { email?: string })?.email ?? "").trim(),
    password: String((body as { password?: string })?.password ?? ""),
  };
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkLoginRateLimit(ip)) {
      return Response.json(
        { ok: false, error: "Demasiados intentos. Probá en unos minutos." },
        { status: 429 }
      );
    }

    const { email, password } = await readCredentials(req);

    if (!email || !password) {
      return Response.json({ ok: false, error: "Faltan datos" }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });

    if (!user) {
      return Response.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return Response.json({ ok: false, error: "Credenciales inválidas" }, { status: 401 });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.adminSession.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("admin_session", rawToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    // Si vino desde form, devolvemos redirect
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      return Response.redirect(new URL("/admin/fotos", req.url), 302);
    }

    // Si vino desde fetch(JSON), devolvemos JSON
    return Response.json({ ok: true });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return Response.json({ ok: false, error: "Error del servidor" }, { status: 500 });
  }
}