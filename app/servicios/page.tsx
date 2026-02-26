import { getContentMap, pick } from "@/lib/content";
import Link from "next/link";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Diseño integral de interiores: residencial, comercial, asesoría y dirección de obra. Zona norte y CABA. Planificación y ejecución con estética atemporal.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: "Toulouse Design — Servicios",
    description:
      "Diseño integral, planificación y ejecución para hogares y espacios comerciales en zona norte y CABA.",
  },
};

export default async function ServiciosPage() {
  const content = await getContentMap();

  const title = pick(content, "services.title", "Servicios");
  const subtitle = pick(
    content,
    "services.subtitle",
    "Diseño integral con foco en funcionalidad y estética atemporal. Planificación y ejecución en Zona Norte y CABA."
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

        <section className="mt-24 border-t border-stone-200 pt-16" aria-labelledby="categorias-heading">
          <h2 id="categorias-heading" className="font-serif text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl">
            Diseño por categoría
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
            Trabajamos todas las piezas del espacio: mobiliario, cortinas, iluminación y mesas para
            un resultado coherente con tu estilo.
          </p>
          <ul className="mt-10 space-y-12">
            <li id="sillones">
              <h3 className="font-serif text-xl font-semibold text-stone-900">Sillones y asientos</h3>
              <p className="mt-2 text-stone-600">
                Selección y diseño de sillones, sofás y butacas que definen el confort del living y
                de espacios comerciales. Medidas, telas y estilos a medida para tu proyecto de
                interiorismo.
              </p>
              <Link href="/galeria" className="mt-2 inline-block text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900">
                Ver en galería
              </Link>
            </li>
            <li id="cortinas">
              <h3 className="font-serif text-xl font-semibold text-stone-900">Cortinas</h3>
              <p className="mt-2 text-stone-600">
                Cortinas y telones para control de luz y privacidad. Desde telas livianas hasta
                blackout, con instalación y asesoría en diseño de interiores para Zona Norte y CABA.
              </p>
              <Link href="/galeria" className="mt-2 inline-block text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900">
                Ver en galería
              </Link>
            </li>
            <li id="iluminacion">
              <h3 className="font-serif text-xl font-semibold text-stone-900">Iluminación</h3>
              <p className="mt-2 text-stone-600">
                Iluminación general, de ambiente y puntual. Lámparas de pie, de techo y apliques
                que integran función y estética en proyectos residenciales y comerciales.
              </p>
              <Link href="/galeria" className="mt-2 inline-block text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900">
                Ver en galería
              </Link>
            </li>
            <li id="mesas">
              <h3 className="font-serif text-xl font-semibold text-stone-900">Mesas y superficies</h3>
              <p className="mt-2 text-stone-600">
                Mesas de living, comedor y apoyo; materiales nobles y diseños que se adaptan al
                espacio. Incluimos en la propuesta integral de diseño de interiores.
              </p>
              <Link href="/galeria" className="mt-2 inline-block text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900">
                Ver en galería
              </Link>
            </li>
          </ul>
        </section>
        <WhatsAppCTA
          title="¿Querés hablar con nosotros?"
          description="Escribinos por WhatsApp y te contamos cómo trabajamos. Respuesta rápida y sin compromiso."
          variant="light"
        />
      </div>
    </main>
  );
}
