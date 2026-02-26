import Container from "./Container";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  const internalLinks = [
    { label: "Inicio", href: "/" },
    { label: "Galería", href: "/galeria" },
    { label: "Servicios", href: "/servicios" },
    { label: "Sobre", href: "/sobre" },
    { label: "Contacto", href: "/contacto" },
  ];

  return (
    <footer className="mt-24 border-t border-stone-200/80 bg-[var(--background)] py-12">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4">
            <nav className="flex flex-wrap gap-x-6 gap-y-1 text-sm" aria-label="Enlaces del sitio">
              {internalLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-sm text-stone-600 transition duration-200 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="text-sm text-stone-500">
              © {year} TOULOUSE. Diseño de interiores.
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <a
              className="rounded-sm text-stone-500 transition duration-200 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
              href="https://instagram.com/toulousedesign"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              className="rounded-sm text-stone-500 transition duration-200 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
              href="https://wa.me/5491112345678"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              className="rounded-sm text-stone-500 transition duration-200 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2"
              href="mailto:hola@toulouse.com"
            >
              Email
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}