"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import type { ContactMessage } from "@/types";

export default function AdminMensajeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/messages/${id}`, {
        cache: "no-store",
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "No se pudo cargar el mensaje.");
        setLoading(false);
        return;
      }

      setMessage(data.message ?? null);
      setLoading(false);
    }

    load();
  }, [id, router]);

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function formatDate(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function markAsRead() {
    if (!message || message.status === "read") return;
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/messages/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "read" }),
    });

    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      setError(data?.error ?? "No se pudo actualizar el estado.");
      setSaving(false);
      return;
    }

    setMessage(data.message ?? message);
    setSaving(false);
  }

  return (
    <main className="min-h-screen py-16">
      <Container>
        <div className="flex items-start justify-between gap-6">
          <div>
            <button
              type="button"
              onClick={() => router.push("/admin/mensajes")}
              className="text-xs font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
            >
              ← Volver a mensajes
            </button>
            <h1 className="mt-2 font-serif text-4xl font-semibold">Mensaje</h1>
            <p className="mt-2 text-neutral-600">
              Detalle del mensaje recibido desde el formulario de contacto.
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
            <div className="flex justify-center py-12">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
            </div>
          ) : !message ? (
            <p className="text-sm text-neutral-600">
              {error ?? "Mensaje no encontrado."}
            </p>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-neutral-900">
                    {message.name}
                  </div>
                  <div className="mt-1 text-sm text-neutral-700">
                    <a
                      href={`mailto:${message.email}`}
                      className="underline underline-offset-2 hover:text-neutral-900"
                    >
                      {message.email}
                    </a>
                  </div>
                  <div className="mt-2 text-xs text-neutral-500">
                    {formatDate(message.createdAt)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      message.status === "read"
                        ? "bg-neutral-100 text-neutral-700"
                        : "bg-black text-white"
                    }`}
                  >
                    {message.status === "read" ? "Leído" : "Nuevo"}
                  </span>
                  <button
                    type="button"
                    onClick={markAsRead}
                    disabled={message.status === "read" || saving}
                    className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                  >
                    {message.status === "read" ? "Ya está leído" : saving ? "Marcando…" : "Marcar como leído"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm leading-relaxed text-neutral-800">
                {message.message.split("\n").map((line, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                    {line || "\u00A0"}
                  </p>
                ))}
              </div>

              {error ? <p className="text-xs text-red-600">{error}</p> : null}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

