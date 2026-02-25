"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Container from "@/components/Container";
import type { GalleryPhoto } from "@/types";

type Props = {
  photos: GalleryPhoto[];
};

export default function GalleryClient({ photos }: Props) {
  const [active, setActive] = useState<string>("Todos");
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of photos) {
      const c = (p.category ?? "").trim();
      if (c) set.add(c);
    }
    return ["Todos", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [photos]);

  const filtered = useMemo(() => {
    const list =
      active === "Todos"
        ? photos
        : photos.filter((p) => p.category === active);
    if (active === "Todos") {
      return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [active, photos]);

  return (
    <main className="min-h-screen py-24 md:py-32">
      <Container>
        <header className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-stone-900 md:text-5xl lg:text-6xl">
            Galería
          </h1>
          <p className="mt-6 text-base leading-relaxed text-stone-600">
            Una selección de proyectos. Filtrá por ambiente para explorar.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            Curamos cada imagen para mostrar la atmósfera real de cada espacio.
          </p>
        </header>

        {/* Filtros */}
        <div className="mt-14 flex flex-wrap gap-2">
          {categories.map((c) => {
            const is = c === active;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full px-5 py-2.5 text-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 ${
                  is
                    ? "bg-stone-900 text-white shadow-sm"
                    : "border border-stone-200 bg-white text-stone-700 shadow-sm hover:border-stone-300 hover:shadow"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="group relative overflow-hidden rounded-2xl bg-white text-left shadow-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 hover:scale-[1.02] hover:shadow-md"
            >
              <div className="relative aspect-square">
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                {p.featured ? (
                  <span className="absolute right-2 top-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
                    Destacada
                  </span>
                ) : null}
              </div>
              <div className="p-6">
                <div className="text-sm font-semibold leading-snug text-stone-900">{p.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-stone-500">{p.category}</div>
              </div>
            </button>
          ))}
        </div>

        {photos.length === 0 ? (
          <p className="mt-12 text-sm text-stone-500">
            Todavía no hay fotos cargadas.
          </p>
        ) : null}

        {/* Modal */}
        {selected ? (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelected(null)}
          >
            <div
              className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                <div>
                  <div className="text-sm font-medium">{selected.title}</div>
                  <div className="mt-1 text-xs text-stone-500">
                    {selected.category}
                  </div>
                </div>
                <button
                  className="rounded-full border border-stone-200 px-4 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
                  onClick={() => setSelected(null)}
                >
                  Cerrar
                </button>
              </div>

              <div className="relative aspect-[16/10] w-full bg-stone-100">
                <Image
                  src={selected.src}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </main>
  );
}