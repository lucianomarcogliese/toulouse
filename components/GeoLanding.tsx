import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/button";
import type { GeoLandingData } from "@/lib/geoLandings";

export default function GeoLanding({ data }: { data: GeoLandingData }) {
  return (
    <>
      <section className="border-b border-stone-200/80 pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-[680px]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            ZONA NORTE · BUENOS AIRES
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-stone-900 md:text-5xl lg:text-6xl">
            {data.h1}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-stone-600">{data.intro}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contacto" variant="primary">
              Agendar consulta
            </Button>
            <Button href="/galeria" variant="outline">
              Ver proyectos
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-stone-50/50 py-16 md:py-20">
        <div className="max-w-[680px]">
          <p className="text-base leading-relaxed text-stone-700">{data.body}</p>
        </div>
      </section>

      <Section
        title="¿Listo para tu proyecto?"
        subtitle="Escribinos y coordinamos una primera charla para conocer tu espacio y tus prioridades."
        className="border-t border-stone-200/80 bg-white"
      >
        <div className="flex flex-wrap items-center gap-6">
          <Button href="/contacto" variant="primary">
            Contacto
          </Button>
          <Link
            href={data.categoryHref}
            className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900"
          >
            {data.categoryLabel}
          </Link>
          <Link
            href="/galeria"
            className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900"
          >
            Ver galería
          </Link>
        </div>
      </Section>
    </>
  );
}
