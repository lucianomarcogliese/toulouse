import { getContentMap, pick } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Diseño integral, planificación y ejecución. Diseño residencial, comercial, asesoría y dirección de obra.",
  openGraph: {
    title: "Servicios | TOULOUSE — Diseño de interiores",
    description:
      "Diseño integral, planificación y ejecución para hogares y espacios comerciales.",
  },
};

export default async function ServiciosPage() {
  const content = await getContentMap();

  const title = pick(content, "services.title", "Servicios");
  const subtitle = pick(
    content,
    "services.subtitle",
    "Diseño integral, planificación y ejecución con foco en funcionalidad y estética."
  );

  const cards = [
    {
      title: pick(content, "services.1.title", "Diseño residencial"),
      desc: pick(
        content,
        "services.1.desc",
        "Propuesta estética y funcional. Selección de materiales y paleta. Planos y render (opcional)."
      ),
    },
    {
      title: pick(content, "services.2.title", "Diseño comercial"),
      desc: pick(
        content,
        "services.2.desc",
        "Concepto de marca y experiencia. Optimización de circulación. Iluminación y mobiliario."
      ),
    },
    {
      title: pick(content, "services.3.title", "Asesoría"),
      desc: pick(
        content,
        "services.3.desc",
        "Visita y diagnóstico. Recomendaciones de compra. Lista de materiales."
      ),
    },
    {
      title: pick(content, "services.4.title", "Dirección de obra"),
      desc: pick(
        content,
        "services.4.desc",
        "Coordinación de proveedores. Control de calidad. Seguimiento de tiempos."
      ),
    },
  ];

  return (
    <main className="min-h-screen py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-stone-900 md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-600">
          {subtitle}
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-md"
            >
              <h2 className="font-serif text-xl font-semibold leading-snug text-stone-900 md:text-2xl">
                {card.title}
              </h2>
              <div className="mt-4 leading-relaxed text-stone-600">
                {card.desc.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-2" : ""}>
                    {line.trim() || "\u00A0"}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
