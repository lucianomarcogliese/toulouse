import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const runtime = "nodejs";

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
    const featured = Boolean((body as { featured?: boolean })?.featured);

    const photo = await prisma.photo.update({
      where: { id },
      data: { featured },
    });

    return Response.json({ ok: true, photo });
  } catch (err: unknown) {
    console.error("FEATURED PATCH ERROR:", err);

    // Prisma "record not found"
    const code = (err as { code?: string })?.code;
    if (code === "P2025") {
      return Response.json(
        { ok: false, error: "Foto no encontrada (id inválido)." },
        { status: 404 }
      );
    }

    return Response.json(
      { ok: false, error: "No se pudo actualizar." },
      { status: 500 }
    );
  }
}