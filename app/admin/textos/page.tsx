"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { CONTENT_KEY_SPECS } from "@/lib/contentKeys";

type Block = { key: string; value: string };

export default function AdminTextosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [blocks, setBlocks] = useState<Record<string, string>>({});

  const ordered = useMemo(() => CONTENT_KEY_SPECS, []);

  const loadRef = useCallback(async () => {
    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/admin/content", { cache: "no-store" });

    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }

    const data = await res.json().catch(() => ({}));
    const list: Block[] = data?.blocks ?? [];
    const map: Record<string, string> = {};
    for (const b of list) map[b.key] = b.value;

    setBlocks(map);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    queueMicrotask(() => loadRef());
  }, [loadRef]);

  async function saveOne(key: string, value: string) {
    setSaving(key);
    setMsg(null);

    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });

    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      setSaving(null);
      setMsg(data?.error ?? "No se pudo guardar.");
      return;
    }

    setSaving(null);
    setMsg("Guardado ✅");
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen py-16">
      <Container>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl font-semibold">Admin · Textos</h1>
            <p className="mt-2 text-neutral-600">
              Editá contenido del sitio sin tocar el código.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900"
          >
            Salir
          </button>
        </div>

        <div className="mt-10 rounded-2xl border border-neutral-200 p-6">
          {loading ? (
            <p className="text-sm text-neutral-600">Cargando…</p>
          ) : (
            <div className="grid gap-6">
              {ordered.map((f) => {
                const value = blocks[f.key] ?? "";
                return (
                  <div key={f.key} className="rounded-2xl border border-neutral-200 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium">{f.label}</div>
                        <div className="mt-1 text-xs text-neutral-500">
                          <span className="font-mono">{f.key}</span>
                          {f.help ? ` · ${f.help}` : ""}
                        </div>
                      </div>

                      <button
                        onClick={() => saveOne(f.key, blocks[f.key] ?? "")}
                        disabled={saving === f.key}
                        className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                      >
                        {saving === f.key ? "Guardando…" : "Guardar"}
                      </button>
                    </div>

                    <div className="mt-4">
                      {f.multiline ? (
                        <textarea
                          value={value}
                          onChange={(e) =>
                            setBlocks((prev) => ({ ...prev, [f.key]: e.target.value }))
                          }
                          rows={5}
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
                        />
                      ) : (
                        <input
                          value={value}
                          onChange={(e) =>
                            setBlocks((prev) => ({ ...prev, [f.key]: e.target.value }))
                          }
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              {msg ? <p className="text-sm text-neutral-700">{msg}</p> : null}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}