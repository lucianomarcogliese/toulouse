"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
  
    setLoading(true);
    setOk(null);
    setError(null);
  
    const fd = new FormData(form);
    const payload = {
      nombre: String(fd.get("nombre") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      mensaje: String(fd.get("mensaje") ?? "").trim(),
      website: String(fd.get("website") ?? "").trim(),
    };
  
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
  
      if (res.ok) {
        setOk(true);
        form.reset();
        return;
      }
  
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }
  
      setOk(false);
      setError(data?.error ?? `Error ${res.status}. Probá de nuevo.`);
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("FETCH ERROR:", err);
      setOk(false);
      setError("Error de red. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="font-serif text-xl font-semibold leading-snug text-stone-900 md:text-2xl">
        Contanos de tu proyecto
      </h2>
      <p className="mt-3 text-stone-600">
        Dejanos tus datos y una breve descripción. Te respondemos en el día, sin compromiso.
      </p>

      <form
        className="relative mt-8 space-y-5"
        onSubmit={onSubmit}
        aria-busy={loading}
        aria-describedby={error ? "contact-error" : ok === true ? "contact-success" : undefined}
      >
        <div>
          <label className="text-sm font-medium text-stone-700" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            placeholder="Tu nombre"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-1 focus:ring-stone-200"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="tu@email.com"
            className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-1 focus:ring-stone-200"
          />
        </div>

        {/* Honeypot: no mostrar a usuarios; bots lo rellenan */}
        <div className="absolute -left-[9999px] top-0 opacity-0" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700" htmlFor="mensaje">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={6}
            placeholder="Contanos qué necesitás (ambiente, m2 aproximados, estilo, plazos, etc.)"
            className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:ring-1 focus:ring-stone-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-stone-900 px-6 py-3.5 text-sm font-medium text-white shadow-sm transition duration-300 hover:opacity-95 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2"
          aria-busy={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>

        {ok === true ? (
          <p id="contact-success" className="text-sm text-stone-600" role="status" aria-live="polite">
            ¡Mensaje enviado! Te respondemos pronto.
          </p>
        ) : null}

        {ok === false ? (
          <p id="contact-error" className="text-sm text-red-600" role="alert" aria-live="assertive">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}