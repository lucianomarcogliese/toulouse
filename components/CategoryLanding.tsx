import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/button";
import FaqAccordion from "@/components/FaqAccordion";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import type { CategoryLandingData } from "@/lib/categoryLandings";
import { getOtherCategoryLinks } from "@/lib/categoryLandings";

interface CategoryLandingProps {
  category: CategoryLandingData;
  whatsappHref?: string | null;
}

export default function CategoryLanding({ category, whatsappHref }: CategoryLandingProps) {
  const otherLinks = getOtherCategoryLinks(category.slug);

  return (
    <>
      {/* Hero — Compacto en móvil */}
      <section className="pt-20 pb-14 md:pt-28 md:pb-24 border-b border-stone-200/80">
        <div className="max-w-[680px]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            INTERIORISMO A MEDIDA
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.08] tracking-tight text-stone-900 md:mt-4 md:text-4xl md:leading-[1.05] lg:text-5xl lg:text-6xl">
            {category.h1}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-stone-600 md:mt-6">
            {category.intro}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8 md:gap-4">
            <Button href="/contacto" variant="primary">
              Agendar consulta
            </Button>
            <Button href="/galeria" variant="outline">
              Ver proyectos
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-stone-600 md:mt-6">
            <span className="font-medium text-stone-500">También diseñamos:</span>
            {otherLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="rounded-sm text-stone-600 underline underline-offset-4 hover:text-stone-900"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Qué hacemos — 3 bullets, poco texto */}
      <Section
        title="Qué hacemos"
        subtitle="En esta categoría."
        className="bg-stone-50/50 border-t border-stone-200/80"
      >
        <ul className="grid gap-4 sm:grid-cols-3 md:gap-6">
          {category.bullets.map((text, i) => (
            <li key={i} className="flex gap-3 rounded-xl bg-white p-5 shadow-sm md:p-6">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-stone-700" aria-hidden />
              <p className="text-sm leading-relaxed text-stone-700">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Materiales — cards cortas */}
      <Section
        title="Materiales y opciones"
        subtitle="Resisten el uso diario."
        className="bg-white border-t border-stone-200/80"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.materials.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:border-stone-300 hover:shadow-md"
            >
              <h3 className="font-serif text-lg font-semibold text-stone-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{card.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Diferencial — una idea */}
      <Section
        title="Toulouse no vende muebles"
        subtitle="Diseñamos piezas que dialogan con la arquitectura y la luz."
        className="bg-stone-50/50 border-t border-stone-200/80"
      >
        <p className="max-w-[520px] text-sm leading-relaxed text-stone-700">
          Cada categoría se integra al proyecto completo. El objetivo es construir una atmósfera que dure en el tiempo.
        </p>
      </Section>

      {/* Proceso — 4 pasos */}
      <Section
        title="Proceso"
        subtitle="De la primera conversación hasta que la pieza está en tu espacio."
        className="bg-white border-t border-stone-200/80"
      >
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {category.process.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white"
                aria-hidden
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-stone-700">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Proyectos — link a galería */}
      <Section
        title="Proyectos con esta categoría"
        subtitle="Ejemplos en galería."
        className="bg-stone-50/50 border-t border-stone-200/80"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md text-sm leading-relaxed text-stone-700">
            Ver combinaciones reales en livings, comedores y locales.
          </p>
          <Button href="/galeria" variant="outline">
            Ver galería
          </Button>
        </div>
      </Section>

      {/* FAQ */}
      <Section
        title="Preguntas frecuentes"
        subtitle="Dudas habituales."
        className="bg-white border-t border-stone-200/80"
      >
        <FaqAccordion items={category.faqs} />
      </Section>

      {/* CTA final — un mensaje, un botón claro */}
      <Section
        title="Diseñemos tu espacio"
        subtitle="Renová o armá tu ambiente con nosotros."
        className="bg-stone-50/50 border-t border-stone-200/80"
      >
        <div className="flex flex-wrap gap-4">
          <Button href="/contacto" variant="primary">
            Agendar consulta
          </Button>
          <Button href="/galeria" variant="outline">
            Ver proyectos realizados
          </Button>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-transparent px-8 py-3.5 text-sm font-medium text-stone-800 transition duration-300 hover:border-stone-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
            >
              Escribir por WhatsApp
            </a>
          ) : null}
        </div>
      </Section>
      <WhatsAppCTA
        title="¿Dudas sobre esta categoría?"
        description="Escribinos por WhatsApp con tu consulta y te respondemos en el día. Podemos coordinar una llamada o reunión para ver tu espacio."
        variant="light"
      />
    </>
  );
}
