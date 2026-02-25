import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { contactMessageStatusSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
      return Response.json({ ok: false, error: "No existe." }, { status: 404 });
    }
    return Response.json({ ok: true, message });
  } catch (err) {
    console.error("MESSAGES GET ERROR:", err);
    return Response.json({ ok: false, error: "Error del servidor." }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const parsed = contactMessageStatusSchema.safeParse((body as { status?: string })?.status);
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: "status debe ser 'read' o 'new'." },
        { status: 400 }
      );
    }
    const status = parsed.data;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    return Response.json({ ok: true, message });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "P2025") {
      return Response.json({ ok: false, error: "No existe." }, { status: 404 });
    }
    console.error("MESSAGES PATCH ERROR:", err);
    return Response.json({ ok: false, error: "Error del servidor." }, { status: 500 });
  }
}
