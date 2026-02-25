import Container from "@/components/Container";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen py-20">
      <Container>
        <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            Admin
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Ingresá tus credenciales para acceder al panel.
          </p>

          <form
            action="/api/admin/login"
            method="post"
            className="mt-8 space-y-5"
          >
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
                placeholder="admin@toulouse.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-neutral-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Ingresar
            </button>
          </form>
        </div>
      </Container>
    </main>
  );
}