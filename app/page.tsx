import Image from "next/image";
import Link from "next/link";
import Button from "@/components/button";
import Container from "@/components/Container";
import Section from "@/components/Section";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import HeroWhatsAppMicrocopy from "@/components/HeroWhatsAppMicrocopy";
import { getContentMap, pick } from "@/lib/content";
import { getFeaturedPhotos, getPhotoAlt } from "@/lib/photos";
import { STATIC_IMAGE_BLUR } from "@/lib/blur";
import type { Metadata } from "next";
import type { GalleryPhoto } from "@/types";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Estudio de interiorismo boutique en zona norte y CABA. Proyectos residenciales y comerciales con calma y carácter. Concepto, materiales y dirección de obra.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Toulouse Design — Inicio",
    description:
      "Estudio de interiorismo boutique. Proyectos residenciales y comerciales en zona norte y CABA.",
  },
};

/** Datos vivos (fotos destacadas, contenido) para que se vean cambios del admin sin redeploy. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContentMap();

  // HERO — Claridad inmediata: qué hacemos, dónde, para quién
  const heroTitle = pick(
    content,
    "home.title",
    "Diseño de interiores boutique en Zona Norte"
  );
  const heroSubtitle = pick(
    content,
    "home.subtitle",
    "Proyectos residenciales y comerciales con calma y carácter."
  );
  const heroByline = pick(
    content,
    "home.byline",
    "Espacios pensados para durar, no para la foto del momento."
  );

  // SECCIÓN SERVICIOS
  const servicesTitle = pick(content, "services.title", "Servicios");
  const servicesSubtitle = pick(
    content,
    "services.subtitle",
    "Soluciones integrales para hogares y espacios comerciales."
  );

  const s1t = pick(content, "services.1.title", "Diseño residencial");
  const s1d = pick(
    content,
    "services.1.desc",
    "Propuestas funcionales y estéticas para tu vida diaria."
  );

  const s2t = pick(content, "services.2.title", "Diseño comercial");
  const s2d = pick(
    content,
    "services.2.desc",
    "Experiencias de marca, circulación e iluminación."
  );

  const s3t = pick(content, "services.3.title", "Dirección de obra");
  const s3d = pick(
    content,
    "services.3.desc",
    "Seguimiento, coordinación y control de calidad."
  );

  // SECCIÓN DESTACADOS
  const featuredTitle = pick(content, "featured.title", "Proyectos destacados");
  const featuredSubtitle = pick(
    content,
    "featured.subtitle",
    "Una selección de trabajos recientes."
  );

  // Imagen principal del hero (opcional desde CMS)
  const heroImage = pick(content, "home.heroImage", "/proyectos/01.jpeg");

  const destacados = await getFeaturedPhotos(4);

  return (
    <main>
      {/* Hero — Más compacto en móvil, botón principal destacado */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-20">
        <Container>
          <div className="max-w-4xl">
            <h1 className="font-serif text-4xl leading-[1.08] tracking-tight text-stone-900 md:text-[56px] md:leading-[1.05] lg:text-[72px]">
              {heroTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 md:mt-8">
              {heroSubtitle}
            </p>

            <p className="mt-3 text-sm tracking-[0.18em] text-stone-500 uppercase md:mt-4">
              Zona Norte y CABA
            </p>
            {heroByline ? (
              <p className="mt-1 text-sm italic text-stone-500 md:mt-2">
                {heroByline}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
              <Button href="/contacto" variant="primary">
                Agendar consulta
              </Button>
              <Button href="/galeria" variant="outline">
                Ver proyectos
              </Button>
            </div>
            <HeroWhatsAppMicrocopy />
          </div>

          <div className="mt-14 overflow-hidden rounded-3xl border border-neutral-200 md:mt-20">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={heroImage}
                alt="Proyecto de interiorismo del estudio Toulouse Design: living o espacio comercial en Zona Norte y CABA"
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1280px) 1280px, 100vw"
                {...(heroImage === "/proyectos/01.jpeg" && {
                  placeholder: "blur",
                  blurDataURL: STATIC_IMAGE_BLUR,
                })}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Servicios */}
      <Section
        title={servicesTitle}
        subtitle={servicesSubtitle}
        className="bg-stone-50/50"
      >
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { t: s1t, d: s1d },
            { t: s2t, d: s2d },
            { t: s3t, d: s3d },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-2xl bg-white p-8 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-md"
            >
              <h3 className="text-lg font-semibold leading-snug text-stone-900">{x.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-stone-600">
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Áreas de cobertura — poco texto, mucho aire */}
      <Section
        title="Dónde trabajamos"
        subtitle="Zona Norte y CABA."
        className="bg-stone-50/50"
      >
        <div className="mx-auto max-w-xl text-center">
          <p className="text-base leading-relaxed text-stone-600">
            Trabajamos en Zona Norte y CABA de punta a punta: desde la primera charla hasta el cierre de obra. Una persona de referencia por proyecto.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/servicios"
              className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900"
            >
              Ver servicios
            </Link>
            <Link
              href="/contacto"
              className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900"
            >
              Contacto
            </Link>
            <span className="text-stone-400">·</span>
            <Link
              href="/servicios#sillones"
              className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900"
            >
              Sillones
            </Link>
            <Link
              href="/servicios#cortinas"
              className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900"
            >
              Cortinas
            </Link>
            <Link
              href="/servicios#iluminacion"
              className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900"
            >
              Iluminación
            </Link>
            <Link
              href="/servicios#mesas"
              className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900"
            >
              Mesas
            </Link>
          </div>
        </div>
      </Section>

      {/* Destacados */}
      <Section
        title={featuredTitle}
        subtitle={featuredSubtitle}
        className="bg-white"
      >
        {destacados.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {destacados.map((p: GalleryPhoto) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-md"
              >
                <div className="relative aspect-square">
                  <Image
                    src={p.src}
                    alt={getPhotoAlt(p)}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold leading-snug text-stone-900">{p.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-stone-500">{p.category}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-3xl border border-stone-200 bg-[var(--section-alt)] px-8 py-10 md:px-10 md:py-12">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
              <div>
                <h3 className="font-serif text-2xl font-semibold leading-[1.15] text-stone-900 md:text-3xl">
                  Estamos preparando una selección de proyectos destacados.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-stone-700 md:text-base">
                  Mientras tanto, podés explorar la galería completa o escribirnos para conversar
                  sobre tu próximo proyecto.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/galeria" variant="primary">
                    Ver galería completa
                  </Button>
                  <Button href="/contacto" variant="outline">
                    Agendar consulta
                  </Button>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <ul className="space-y-2 text-sm text-stone-700">
                  {["Residencial", "Comercial", "Dirección de obra"].map((label) => (
                    <li key={label} className="flex items-center gap-2">
                      <span className="h-[3px] w-6 rounded-full bg-stone-700" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Confianza — números e ideas cortas */}
      <Section
        title="Confianza y experiencia"
        subtitle="Rigor y cercanía en cada proyecto. Una persona de referencia desde el primer día hasta la entrega."
        className="border-t border-stone-200/80 bg-stone-50/50"
      >
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <div
            className="rounded-2xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-md md:p-8 animate-fade-in-hero"
            style={{ animationDelay: "0.1s" }}
          >
            <p className="font-serif text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
              +50
            </p>
            <p className="mt-1 text-base font-medium text-stone-700">
              proyectos realizados
            </p>
          </div>
          <div
            className="rounded-2xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-md md:p-8 animate-fade-in-hero"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="font-serif text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl">
              Atención personalizada
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Una persona de referencia por proyecto.
            </p>
          </div>
          <div
            className="rounded-2xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-md md:p-8 animate-fade-in-hero"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="font-serif text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl">
              Dirección integral de obra
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Coordinación y control de calidad hasta el cierre.
            </p>
          </div>
        </div>
      </Section>
      <WhatsAppCTA
        title="¿Consultas sobre tu proyecto?"
        description="Escribinos por WhatsApp y te respondemos en el día. Contanos el ambiente o la idea y coordinamos una primera charla."
        variant="light"
      />
    </main>
  );
}