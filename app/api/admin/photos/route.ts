import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { photoCreateSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const photos = await prisma.photo.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return Response.json({ ok: true, photos });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = photoCreateSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => e.message).join("; ") || "Faltan campos.";
      return Response.json({ ok: false, error: msg }, { status: 400 });
    }
    const { title, category, src, featured, publicId } = parsed.data;

    const maxOrder = await prisma.photo.aggregate({ _max: { sortOrder: true } });
    const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const photo = await prisma.photo.create({
      data: {
        title,
        category,
        src,
        featured,
        sortOrder: nextOrder,
        cloudinaryId: publicId ?? undefined,
      },
    });

    return Response.json({ ok: true, photo });
  } catch (err) {
    console.error("CREATE PHOTO ERROR:", err);
    return Response.json({ ok: false, error: "Error del servidor." }, { status: 500 });
  }
}