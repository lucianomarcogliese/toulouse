import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { photoPatchSchema } from "@/lib/validations";
import { isCloudinaryConfigured, deleteImage } from "@/lib/cloudinary";

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
    const parsed = photoPatchSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => e.message).join("; ") || "Datos inválidos.";
      return Response.json({ ok: false, error: msg }, { status: 400 });
    }
    const data = parsed.data;
    if (Object.keys(data).length === 0) {
      return Response.json({ ok: false, error: "Nada que actualizar." }, { status: 400 });
    }

    const photo = await prisma.photo.update({
      where: { id },
      data,
    });
    return Response.json({ ok: true, photo });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "P2025") {
      return Response.json({ ok: false, error: "Foto no encontrada." }, { status: 404 });
    }
    console.error("PHOTO PATCH ERROR:", err);
    return Response.json({ ok: false, error: "No se pudo actualizar." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      return Response.json({ ok: false, error: "No existe." }, { status: 404 });
    }

    await prisma.photo.delete({ where: { id } });

    const cloudinaryId = photo.cloudinaryId;
    if (cloudinaryId && isCloudinaryConfigured()) {
      try {
        await deleteImage(cloudinaryId);
      } catch (e) {
        console.warn("PHOTO DELETE: no se pudo borrar en Cloudinary:", cloudinaryId, e);
      }
    } else {
      const src = photo.src.trim();
      if (src.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
        try {
          await fs.unlink(filePath);
        } catch (e) {
          console.warn("PHOTO DELETE: no se pudo borrar archivo local:", filePath, e);
        }
      }
    }

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "P2025") {
      return Response.json({ ok: false, error: "No existe." }, { status: 404 });
    }
    console.error("PHOTO DELETE ERROR:", err);
    return Response.json({ ok: false, error: "No se pudo borrar." }, { status: 500 });
  }
}
