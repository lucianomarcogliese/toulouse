import Image from "next/image";
import Button from "@/components/button";
import Container from "@/components/Container";
import Section from "@/components/Section";
import { getContentMap, pick } from "@/lib/content";
import { getFeaturedPhotos } from "@/lib/photos";
import { STATIC_IMAGE_BLUR } from "@/lib/blur";
import type { Metadata } from "next";
import type { GalleryPhoto } from "@/types";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Estudio de diseño de interiores con calma y carácter. Proyectos residenciales y comerciales. Concepto, selección de materiales y dirección de obra.",
  openGraph: {
    title: "Inicio | TOULOUSE — Diseño de interiores",
    description:
      "Estudio de diseño de interiores con calma y carácter. Proyectos residenciales y comerciales.",
  },
};

export default async function HomePage() {
  const content = await getContentMap();

  // HERO
  const heroTitle = pick(
    content,
    "home.title",
    "Diseño de interiores con calma, luz y carácter"
  );
  const heroSubtitle = pick(
    content,
    "home.subtitle",
    "Proyectos residenciales y comerciales. Concepto, selección de materiales y dirección de obra con una estética atemporal."
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
      {/* Hero */}      
      <section className="pt-28 pb-20">
        <Container>
          <div className="max-w-4xl">
            <h1 className="font-serif text-[56px] leading-[1.05] tracking-tight md:text-[72px]">
              Diseño de interiores
              <br />
              con calma y carácter
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600">
              Proyectos residenciales y comerciales. Concepto, selección de
              materiales y dirección de obra con una estética atemporal
              y una ejecución cuidada.
            </p>

            <p className="mt-4 text-sm tracking-[0.18em] text-stone-500 uppercase">
              Estudio de interiorismo boutique
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/contacto" variant="primary">
                Agendar consulta
              </Button>
              <Button href="/galeria" variant="outline">
                Ver proyectos
              </Button>
            </div>
          </div>

          <div className="mt-20 overflow-hidden rounded-3xl border border-neutral-200">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={heroImage}
                alt="Proyecto Toulouse"
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
                    alt={p.title}
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
    </main>
  );
}