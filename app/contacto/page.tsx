import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { getContentMap, pick } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá al estudio Toulouse para tu proyecto de interiorismo. Consultas, presupuestos y coordinación de primera charla.",
  alternates: { canonical: "/contacto" },
  openGraph: {
    title: "Contacto | TOULOUSE — Diseño de interiores",
    description:
      "Contactá al estudio Toulouse para tu proyecto de interiorismo.",
  },
};

export default async function ContactoPage() {
  const content = await getContentMap();

  const title = pick(content, "contact.title", "Contacto");
  const text = pick(
    content,
    "contact.text",
    "Contanos sobre tu espacio y te respondemos a la brevedad. Si preferís, escribinos directo por WhatsApp."
  );

  const cardTitle = pick(content, "contact.card.title", "Escribinos");
  const cardText = pick(
    content,
    "contact.card.text",
    "Coordinamos una primera charla para entender necesidades, estilo y presupuesto estimado."
  );

  const email = pick(content, "contact.email", "hola@toulouse.com");
  const whatsapp = pick(content, "contact.whatsapp", "5491112345678");
  const whatsappMessage = pick(
    content,
    "contact.whatsappMessage",
    "Hola Toulouse, quiero consultar por un proyecto de interiorismo."
  );

  const hoursTitle = pick(content, "contact.hours.title", "Horario");
  const hoursText = pick(content, "contact.hours.text", "Lun a Vie · 10:00 a 18:00");

  const locationTitle = pick(content, "contact.location.title", "Ubicación");
  const locationText = pick(content, "contact.location.text", "(Agregar dirección / ciudad)");
  const locationNote = pick(content, "contact.location.note", "Atención con cita previa.");

  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-stone-900 md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-stone-600">
            {text}
          </p>
        </header>

        <div className="mt-16 grid gap-14 lg:grid-cols-2">
          <section className="space-y-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:scale-[1.01] hover:shadow-md">
              <h2 className="font-serif text-xl font-semibold leading-snug text-stone-900 md:text-2xl">
                {cardTitle}
              </h2>
              <p className="mt-4 leading-relaxed text-stone-600">{cardText}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition duration-300 hover:opacity-95 hover:shadow-md"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:${email}`}
                  className="rounded-full border border-stone-200 px-6 py-3 text-sm font-medium text-stone-700 shadow-sm transition duration-300 hover:border-stone-300 hover:shadow"
                >
                  {email}
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:scale-[1.01] hover:shadow-md">
              <h3 className="text-base font-semibold leading-snug text-stone-900">{hoursTitle}</h3>
              <p className="mt-3 leading-relaxed text-stone-600">{hoursText}</p>

              <div className="mt-6 border-t border-stone-100 pt-6">
                <h3 className="text-base font-semibold leading-snug text-stone-900">{locationTitle}</h3>
                <p className="mt-2 leading-relaxed text-stone-600">{locationText}</p>
                <p className="mt-3 text-sm text-stone-500">{locationNote}</p>
              </div>
            </div>

            <Link
              href="/galeria"
              className="inline-block text-sm font-medium text-stone-600 underline underline-offset-4 transition hover:text-stone-900"
            >
              Ver proyectos →
            </Link>
          </section>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
