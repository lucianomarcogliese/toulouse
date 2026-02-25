import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { reorderDirectionSchema } from "@/lib/validations";

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
    const parsed = reorderDirectionSchema.safeParse((body as { direction?: string })?.direction);
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: "direction debe ser 'up' o 'down'." },
        { status: 400 }
      );
    }
    const direction = parsed.data;

    const all = await prisma.photo.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    const idx = all.findIndex((p) => p.id === id);
    if (idx < 0) {
      return Response.json({ ok: false, error: "Foto no encontrada." }, { status: 404 });
    }

    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= all.length) {
      return Response.json({ ok: true, photo: all[idx] });
    }

    const current = all[idx];
    const reordered = [...all];
    reordered.splice(idx, 1);
    reordered.splice(newIdx, 0, current);

    await prisma.$transaction(
      reordered.map((photo, position) =>
        prisma.photo.update({
          where: { id: photo.id },
          data: { sortOrder: position },
        })
      )
    );

    const photo = await prisma.photo.findUnique({ where: { id } });
    return Response.json({ ok: true, photo });
  } catch (err) {
    console.error("REORDER ERROR:", err);
    return Response.json({ ok: false, error: "No se pudo reordenar." }, { status: 500 });
  }
}
