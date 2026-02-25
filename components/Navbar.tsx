"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const nav = [
  { label: "Galería", href: "/galeria" },
  { label: "Servicios", href: "/servicios" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = useMemo(() => {
    return (href: string) => pathname === href;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[var(--background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.35em] uppercase text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 rounded-sm"
        >
          TOULOUSE
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 rounded-sm ${
                isActive(item.href)
                  ? "text-stone-900 underline underline-offset-8"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden rounded-full border border-stone-200 px-4 py-2 text-xs font-medium text-stone-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          Menú
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-stone-200/80 bg-[var(--background)] md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <nav className="flex flex-col gap-3">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 rounded-sm ${
                    isActive(item.href)
                      ? "text-stone-900 underline underline-offset-8"
                      : "text-stone-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}