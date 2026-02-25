import Link from "next/link";
import Container from "@/components/Container";

export default function AdminPage() {
  return (
    <main className="min-h-screen py-16">
      <Container>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl font-semibold">Panel Admin</h1>
            <p className="mt-2 text-neutral-600">
              Gestioná fotos y contenidos del sitio.
            </p>
          </div>

          <form action="/api/admin/logout" method="post">
            <button className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900">
              Salir
            </button>
          </form>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/fotos"
            className="rounded-2xl border border-neutral-200 p-6 transition hover:border-neutral-900"
          >
            <div className="text-lg font-medium">Fotos</div>
            <div className="mt-2 text-sm text-neutral-600">
              Subir, eliminar, marcar destacadas.
            </div>
          </Link>

          <Link
            href="/admin/textos"
            className="rounded-2xl border border-neutral-200 p-6 transition hover:border-neutral-900"
          >
            <div className="text-lg font-medium">Textos</div>
            <div className="mt-2 text-sm text-neutral-600">
              Editar Home, Sobre y secciones.
            </div>
          </Link>
        </div>
      </Container>
    </main>
  );
}