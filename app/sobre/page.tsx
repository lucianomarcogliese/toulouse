import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { getContentMap, pick } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Estudio Toulouse Design: interiorismo enfocado en espacios serenos y funcionales. Zona norte y CABA. Proceso claro de punta a punta.",
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: "Toulouse Design — Sobre nosotros",
    description:
      "Estudio de interiorismo enfocado en espacios serenos, cálidos y funcionales. Zona norte y CABA.",
  },
};

const valoresFallback = [
  {
    title: "Funcionalidad primero",
    body: "Diseñamos para el día a día: circulación, luz, guardado y proporción.",
  },
  {
    title: "Atemporalidad",
    body: "Evitamos modas pasajeras. Buscamos materiales nobles y decisiones que duren.",
  },
  {
    title: "Detalle y coherencia",
    body: "De la paleta al herraje. Todo conversa y responde a un concepto claro.",
  },
];

const procesoFallback = [
  {
    step: "01",
    title: "Brief & diagnóstico",
    body: "Relevamiento del espacio, necesidades, estilo y presupuesto estimado.",
  },
  {
    step: "02",
    title: "Concepto",
    body: "Moodboard, paleta, materiales y lineamientos de diseño.",
  },
  {
    step: "03",
    title: "Proyecto",
    body: "Planos, layout, selección de mobiliario e iluminación. Render opcional.",
  },
  {
    step: "04",
    title: "Ejecución",
    body: "Coordinación, seguimiento y control de calidad hasta el cierre.",
  },
];

function resolveAboutImageSrc(): string | null {
  const candidates = [
    "/proyectos/01.jpeg",
    "/proyectos/02.jpeg",
    "/uploads/01.jpeg",
    "/uploads/hero.jpg",
  ];
  const publicDir = path.join(process.cwd(), "public");

  for (const rel of candidates) {
    const full = path.join(publicDir, rel.replace(/^\//, ""));
    if (fs.existsSync(full)) return rel;
  }

  return null;
}

export default async function SobrePage() {
  const content = await getContentMap();
  const aboutImageSrc = resolveAboutImageSrc();

  const pageTitle = pick(content, "about.title", "Sobre Toulouse");
  const pageText = pick(
    content,
    "about.text",
    "Somos un estudio de diseño de interiores enfocado en crear espacios serenos, cálidos y funcionales. Acompañamos cada proyecto de punta a punta: desde la idea hasta la ejecución, con un proceso claro y transparente."
  );

  const enfoqueTitle = pick(content, "about.enfoque.title", "Nuestro enfoque");
  const enfoqueSubtitle = pick(
    content,
    "about.enfoque.subtitle",
    "Diseñamos con criterio: decisiones simples, materiales honestos y detalles bien resueltos."
  );

  const procesoTitle = pick(content, "about.proceso.title", "Proceso de trabajo");
  const procesoSubtitle = pick(
    content,
    "about.proceso.subtitle",
    "Un método claro para que sepas qué esperar en cada etapa."
  );

  // Valores (3)
  const valores = [0, 1, 2].map((i) => ({
    title: pick(content, `about.values.${i + 1}.title`, valoresFallback[i].title),
    body: pick(content, `about.values.${i + 1}.body`, valoresFallback[i].body),
  }));

  // Proceso (4)
  const proceso = [0, 1, 2, 3].map((i) => ({
    step: pick(content, `about.process.${i + 1}.step`, procesoFallback[i].step),
    title: pick(content, `about.process.${i + 1}.title`, procesoFallback[i].title),
    body: pick(content, `about.process.${i + 1}.body`, procesoFallback[i].body),
  }));

  // (Opcional) Imagen placeholder configurable: about.image (por ahora seguimos placeholder)
  // const aboutImage = pick(content, "about.image", "");

  const ctaTitle = pick(content, "about.cta.title", "¿Empezamos con tu proyecto?");
  const ctaText = pick(
    content,
    "about.cta.text",
    "Contanos el ambiente, metros aproximados y el tipo de intervención."
  );
  const ctaButton = pick(content, "about.cta.button", "Contactar");

  return (
    <main className="min-h-screen py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <header className="grid gap-14 lg:grid-cols-2 lg:items-end">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-stone-900 md:text-5xl lg:text-6xl">
              {pageTitle}
            </h1>

            <p className="mt-6 text-base leading-relaxed text-stone-600">
              {pageText}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contacto"
                className="rounded-full bg-stone-900 px-8 py-3.5 text-sm font-medium text-white shadow-sm transition duration-300 hover:opacity-95 hover:shadow-md"
              >
                Agendar una consulta
              </Link>
              <Link
                href="/galeria"
                className="rounded-full border border-stone-200 px-8 py-3.5 text-sm font-medium text-stone-700 shadow-sm transition duration-300 hover:border-stone-300 hover:shadow"
              >
                Ver proyectos
              </Link>
            </div>
          </div>

          {/* Imagen editorial derecha */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
            {aboutImageSrc ? (
              <>
                <Image
                  src={aboutImageSrc}
                  alt="Proyecto del estudio Toulouse"
                  fill
                  className="object-cover"
                  priority
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-black/5 mix-blend-multiply"
                  aria-hidden
                />
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-stone-500">
                Imagen próximamente
              </div>
            )}
          </div>
        </header>

        {/* Valores */}
        <section className="mt-28 md:mt-36">
          <h2 className="font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-stone-900 md:text-5xl">
            {enfoqueTitle}
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-stone-600">
            {enfoqueSubtitle}
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {valores.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <h3 className="text-lg font-semibold leading-snug text-stone-900">{v.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-stone-600">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Proceso */}
        <section className="mt-28 md:mt-36">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-stone-900 md:text-5xl">
                {procesoTitle}
              </h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-stone-600">
                {procesoSubtitle}
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {proceso.map((p) => (
              <div
                key={p.step}
                className="rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <div className="flex items-start gap-5">
                  <div className="text-sm font-medium leading-relaxed text-stone-500">
                    {p.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-snug text-stone-900">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-stone-600">
                      {p.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-28 rounded-2xl bg-white p-10 shadow-sm md:mt-36">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold leading-tight text-stone-900 md:text-3xl">
                {ctaTitle}
              </h2>
              <p className="mt-4 leading-relaxed text-stone-600">{ctaText}</p>
            </div>

            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-8 py-3.5 text-sm font-medium text-white shadow-sm transition duration-300 hover:opacity-95 hover:shadow-md"
            >
              {ctaButton}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}