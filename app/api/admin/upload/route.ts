import fs from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/requireAdmin";
import { isCloudinaryConfigured, uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json(
        { ok: false, error: "Falta archivo." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isCloudinaryConfigured()) {
      const safeName = `${Date.now()}-${file.name}`.replaceAll(" ", "-");
      const { url, publicId } = await uploadImage(buffer, safeName);
      return Response.json({ ok: true, url, publicId });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const safeName = `${Date.now()}-${file.name}`.replaceAll(" ", "-");
    const outPath = path.join(uploadsDir, safeName);
    await fs.writeFile(outPath, buffer);
    return Response.json({ ok: true, url: `/uploads/${safeName}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("UPLOAD ERROR:", err);
    // Mensaje más claro para el usuario (sin exponer detalles internos)
    let userMessage = "Error subiendo archivo.";
    if (message.includes("Cloudinary") || message.includes("credentials") || message.includes("Unauthorized")) {
      userMessage = "Revisá CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en Vercel.";
    } else if (message.includes("EACCES") || message.includes("read-only")) {
      userMessage = "En Vercel hay que usar Cloudinary. Revisá las variables CLOUDINARY_*.";
    }
    return Response.json(
      { ok: false, error: userMessage },
      { status: 500 }
    );
  }
}
