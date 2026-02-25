"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import type { ContactMessage } from "@/types";

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export default function AdminMensajesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(page = 1) {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/admin/messages?page=${page}`, {
      cache: "no-store",
    });

    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      setError(data?.error ?? "No se pudieron cargar los mensajes.");
      setLoading(false);
      return;
    }

    setMessages(data.messages ?? []);
    setPagination(data.pagination ?? null);
    setLoading(false);
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function getPreview(text: string) {
    const t = text.replace(/\s+/g, " ").trim();
    if (t.length <= 120) return t;
    return `${t.slice(0, 117)}…`;
  }

  function statusLabel(status: ContactMessage["status"]) {
    if (status === "read") return "Leído";
    return "Nuevo";
  }

  return (
    <main className="min-h-screen py-16">
      <Container>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl font-semibold">Admin · Mensajes</h1>
            <p className="mt-2 text-neutral-600">
              Bandeja de entrada de los formularios de contacto.
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
          ) : messages.length === 0 ? (
            <p className="text-sm text-neutral-600">
              {error ?? "Todavía no hay mensajes recibidos."}
            </p>
          ) : (
            <div className="space-y-3">
              <div className="hidden gap-4 border-b border-neutral-200 pb-2 text-xs text-neutral-500 md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.6fr)_minmax(0,2.4fr)_minmax(0,1.2fr)_80px]">
                <span>Nombre</span>
                <span>Email</span>
                <span>Mensaje</span>
                <span>Fecha</span>
                <span className="text-right">Estado</span>
              </div>

              <div className="space-y-2">
                {messages.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => router.push(`/admin/mensajes/${m.id}`)}
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-left text-sm transition hover:border-neutral-900 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 md:hidden">
                      <div>
                        <div className="font-medium text-neutral-900">{m.name}</div>
                        <div className="mt-0.5 text-xs text-neutral-500">{m.email}</div>
                        <div className="mt-2 text-xs text-neutral-600">
                          {getPreview(m.message)}
                        </div>
                        <div className="mt-2 text-[11px] text-neutral-500">
                          {formatDate(m.createdAt)}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          m.status === "read"
                            ? "bg-neutral-100 text-neutral-700"
                            : "bg-black text-white"
                        }`}
                      >
                        {statusLabel(m.status)}
                      </span>
                    </div>

                    <div className="hidden items-center gap-4 md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.6fr)_minmax(0,2.4fr)_minmax(0,1.2fr)_80px]">
                      <div className="truncate text-neutral-900">{m.name}</div>
                      <div className="truncate text-neutral-700">{m.email}</div>
                      <div className="truncate text-neutral-600">
                        {getPreview(m.message)}
                      </div>
                      <div className="truncate text-xs text-neutral-500">
                        {formatDate(m.createdAt)}
                      </div>
                      <div className="flex justify-end">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            m.status === "read"
                              ? "bg-neutral-100 text-neutral-700"
                              : "bg-black text-white"
                          }`}
                        >
                          {statusLabel(m.status)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {pagination && pagination.pages > 1 ? (
                <div className="mt-4 flex items-center justify-between gap-4 text-xs text-neutral-600">
                  <div>
                    Página {pagination.page} de {pagination.pages} · {pagination.total}{" "}
                    mensajes
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={pagination.page <= 1}
                      onClick={() => load(pagination.page - 1)}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium disabled:opacity-40"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => load(pagination.page + 1)}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium disabled:opacity-40"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              ) : null}

              {error ? (
                <p className="mt-2 text-xs text-red-600">
                  {error}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

