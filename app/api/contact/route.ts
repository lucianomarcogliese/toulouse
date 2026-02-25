import { Resend } from "resend";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkContactRateLimit } from "@/lib/rateLimit";
import { contactFormSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ") || "Faltan datos obligatorios.";
      return Response.json({ ok: false, error: msg }, { status: 400 });
    }
    const { nombre, email, mensaje, website } = parsed.data;

    const ip = getClientIp(req);
    if (!checkContactRateLimit(ip)) {
      return Response.json(
        { ok: false, error: "Demasiados intentos. Probá en unos minutos." },
        { status: 429 }
      );
    }

    if (website) {
      return Response.json({ ok: true });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: nombre,
        email,
        message: mensaje,
        status: "new",
      },
    });

    const resend = new Resend(env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: "Toulouse <onboarding@resend.dev>",
      to: "lucianomarcogliese@gmail.com",
      subject: "Nuevo mensaje desde la web",
      html: `
        <h2>Nuevo contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return Response.json({ ok: true, id: result.data?.id ?? contact.id });
  } catch (error) {
    console.error("CONTACT API ERROR:", error);
    return Response.json(
      { ok: false, error: "Error enviando el mensaje." },
      { status: 500 }
    );
  }
}
