import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const blocks = await prisma.contentBlock.findMany({
    orderBy: { key: "asc" },
  });

  return Response.json({ ok: true, blocks });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const key = String(body?.key ?? "").trim();
    const value = String(body?.value ?? "").trim();

    if (!key) {
      return Response.json({ ok: false, error: "Falta key." }, { status: 400 });
    }

    const block = await prisma.contentBlock.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return Response.json({ ok: true, block });
  } catch (err) {
    console.error("CONTENT POST ERROR:", err);
    return Response.json({ ok: false, error: "Error del servidor." }, { status: 500 });
  }
}