"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { getPhotoAlt } from "@/lib/photoAlt";
import type { Photo } from "@/types";

const categories = ["Sillas", "Cortinas", "Sillones", "Mesas", "Lámparas"];

type CreatePhase = "idle" | "uploading" | "saving";

export default function AdminFotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [createPhase, setCreatePhase] = useState<CreatePhase>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, { title: string; category: string; featured: boolean }>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const router = useRouter();

  const filteredPhotos = useMemo(() => {
    if (!categoryFilter) return photos;
    return photos.filter((p) => p.category === categoryFilter);
  }, [photos, categoryFilter]);

  function showToast(message: string) {
    setToast(message);
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const loadRef = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/photos", { cache: "no-store" });

    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }

    const data = await res.json().catch(() => ({}));
    setPhotos(data.photos ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    queueMicrotask(() => loadRef());
  }, [loadRef]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const title = String(fd.get("title") ?? "").trim();
    const category = String(fd.get("category") ?? "").trim();
    const featured = fd.get("featured") === "on";

    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setMsg("Seleccioná una imagen.");
      return;
    }

    const up = new FormData();
    up.set("file", file);

    setCreatePhase("uploading");
    const upRes = await fetch("/api/admin/upload", {
      method: "POST",
      body: up,
    });

    if (upRes.status === 401) {
      router.push("/admin/login");
      setCreatePhase("idle");
      return;
    }

    const upData = await upRes.json().catch(() => ({}));
    if (!upRes.ok || !upData?.ok) {
      setCreatePhase("idle");
      setMsg(upData?.error ?? "No se pudo subir la imagen.");
      return;
    }

    setCreatePhase("saving");
    const createRes = await fetch("/api/admin/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        featured,
        src: upData.url,
        ...(upData.publicId != null ? { publicId: upData.publicId } : {}),
      }),
    });

    if (createRes.status === 401) {
      router.push("/admin/login");
      setCreatePhase("idle");
      return;
    }

    const createData = await createRes.json().catch(() => ({}));
    if (!createRes.ok || !createData?.ok) {
      setCreatePhase("idle");
      setMsg(createData?.error ?? "No se pudo guardar.");
      return;
    }

    form.reset();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setCreatePhase("idle");
    await loadRef();
    showToast("Foto agregada");
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar esta foto?")) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });

    if (res.status === 401) {
      router.push("/admin/login");
      setDeletingId(null);
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.ok) {
      showToast(data?.error ?? "No se pudo borrar.");
      setDeletingId(null);
      return;
    }

    await loadRef();
    setDeletingId(null);
    showToast("Foto eliminada");
  }

  async function onToggleFeatured(p: Photo) {
    setTogglingId(p.id);
    const res = await fetch(`/api/admin/photos/${p.id}/featured`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });

    if (res.status === 401) {
      router.push("/admin/login");
      setTogglingId(null);
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.ok) {
      showToast(data?.error ?? "No se pudo actualizar.");
      setTogglingId(null);
      return;
    }

    await loadRef();
    setTogglingId(null);
    showToast(p.featured ? "Quitada de destacadas" : "Marcada como destacada");
  }

  async function copyUrl(photo: Photo) {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}${photo.src}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("URL copiada");
    } catch {
      showToast("No se pudo copiar");
    }
  }

  function getEdit(p: Photo) {
    return (
      editing[p.id] ?? {
        title: p.title,
        category: p.category,
        featured: p.featured,
      }
    );
  }

  function setEdit(id: string, patch: Partial<{ title: string; category: string; featured: boolean }>) {
    const p = photos.find((x) => x.id === id);
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...(p ? (prev[id] ?? { title: p.title, category: p.category, featured: p.featured }) : prev[id] ?? {}),
        ...patch,
      },
    }));
  }

  async function onSave(p: Photo) {
    const e = getEdit(p);
    if (e.title === p.title && e.category === p.category && e.featured === p.featured) {
      showToast("Sin cambios");
      return;
    }
    setSavingId(p.id);
    const res = await fetch(`/api/admin/photos/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: e.title, category: e.category, featured: e.featured }),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      setSavingId(null);
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      showToast(data?.error ?? "No se pudo guardar.");
      setSavingId(null);
      return;
    }
    await loadRef();
    setEditing((prev) => {
      const next = { ...prev };
      delete next[p.id];
      return next;
    });
    setSavingId(null);
    showToast("Guardado");
  }

  async function onReorder(p: Photo, direction: "up" | "down") {
    setReorderingId(p.id);
    const res = await fetch(`/api/admin/photos/${p.id}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      setReorderingId(null);
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok && !data?.ok) showToast(data?.error ?? "No se pudo reordenar.");
    await loadRef();
    setReorderingId(null);
    if (res.ok && data?.ok) showToast(direction === "up" ? "Subido" : "Bajado");
  }

  const createBusy = createPhase !== "idle";

  return (
    <main className="min-h-screen py-16">
      <Container>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl font-semibold">Admin · Fotos</h1>
            <p className="mt-2 text-neutral-600">
              Subí imágenes, asigná categoría y marcá destacadas.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900"
          >
            Salir
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* Form */}
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-medium">Agregar foto</h2>

            <form className="mt-6 space-y-4" onSubmit={onCreate}>
              <div>
                <label className="text-sm font-medium">Título</label>
                <p className="mt-1 text-xs text-stone-500">
                  Descriptivo para SEO (ej: Sillón a medida en living moderno Zona Norte)
                </p>
                <input
                  name="title"
                  required
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Categoría</label>
                <select
                  name="category"
                  required
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900"
                  defaultValue={categories[0]}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input id="featured" name="featured" type="checkbox" />
                <label htmlFor="featured" className="text-sm font-medium">
                  Destacada
                </label>
              </div>

              <div>
                <label className="text-sm font-medium">Imagen</label>
                <input
                  name="file"
                  type="file"
                  accept="image/*"
                  required
                  className="mt-2 w-full text-sm"
                  onChange={onFileChange}
                />
                {previewUrl ? (
                  <div className="mt-3 relative aspect-square max-h-48 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={createBusy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {createPhase === "uploading" && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {createPhase === "saving" && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {createPhase === "uploading"
                  ? "Subiendo…"
                  : createPhase === "saving"
                    ? "Guardando…"
                    : "Guardar"}
              </button>

              {msg ? <p className="text-sm text-neutral-700">{msg}</p> : null}
            </form>
          </div>

          {/* List */}
          <div className="rounded-2xl border border-neutral-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-medium">Fotos</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryFilter("")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    !categoryFilter
                      ? "bg-black text-white"
                      : "border border-neutral-300 hover:border-neutral-900"
                  }`}
                >
                  Todas
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategoryFilter(c)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      categoryFilter === c
                        ? "bg-black text-white"
                        : "border border-neutral-300 hover:border-neutral-900"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="mt-8 flex justify-center py-12">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPhotos.map((p) => (
                  <div
                    key={p.id}
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                  >
                    <div className="relative aspect-square bg-neutral-100">
                      {p.featured ? (
                        <div className="absolute left-3 top-3 z-10 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                          Destacada
                        </div>
                      ) : null}
                      {(deletingId === p.id || togglingId === p.id || reorderingId === p.id) && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                          <span className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      )}
                      <Image
                        src={p.src}
                        alt={getPhotoAlt(p)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    <div className="p-4">
                      <div className="space-y-2">
                        <input
                          value={getEdit(p).title}
                          onChange={(e) => setEdit(p.id, { title: e.target.value })}
                          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                          placeholder="Título"
                        />
                        <select
                          value={getEdit(p).category}
                          onChange={(e) => setEdit(p.id, { category: e.target.value })}
                          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={getEdit(p).featured}
                            onChange={(e) => setEdit(p.id, { featured: e.target.checked })}
                          />
                          Destacada
                        </label>
                        <button
                          type="button"
                          onClick={() => onSave(p)}
                          disabled={savingId !== null || deletingId !== null || togglingId !== null}
                          className="w-full rounded-full bg-black px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                        >
                          {savingId === p.id ? "Guardando…" : "Guardar"}
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onReorder(p, "up")}
                          disabled={reorderingId !== null || deletingId !== null}
                          className="rounded-full border border-neutral-300 px-2 py-1 text-xs hover:border-neutral-900 disabled:opacity-50"
                          title="Subir"
                        >
                          ↑ Subir
                        </button>
                        <button
                          type="button"
                          onClick={() => onReorder(p, "down")}
                          disabled={reorderingId !== null || deletingId !== null}
                          className="rounded-full border border-neutral-300 px-2 py-1 text-xs hover:border-neutral-900 disabled:opacity-50"
                          title="Bajar"
                        >
                          ↓ Bajar
                        </button>
                        <button
                          type="button"
                          onClick={() => copyUrl(p)}
                          className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:border-neutral-900"
                        >
                          Copiar URL
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleFeatured(p)}
                          disabled={togglingId !== null || deletingId !== null}
                          className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:border-neutral-900 disabled:opacity-50"
                        >
                          {p.featured ? "Quitar destacada" : "Marcar destacada"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(p.id)}
                          disabled={deletingId !== null || togglingId !== null}
                          className="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 hover:border-red-600 disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredPhotos.length === 0 ? (
              <p className="mt-6 text-sm text-neutral-600">
                {photos.length === 0
                  ? "Todavía no hay fotos cargadas."
                  : "Ninguna foto en esta categoría."}
              </p>
            ) : null}
          </div>
        </div>
      </Container>

      {/* Toast */}
      {toast ? (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </main>
  );
}
