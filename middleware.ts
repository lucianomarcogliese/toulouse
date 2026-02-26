import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPrivateMode } from "@/lib/siteMode";

/** Rutas que nunca requieren Basic Auth (assets, sitemap, robots). */
function isAllowedWithoutAuth(pathname: string): boolean {
  if (pathname.startsWith("/_next/")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname.startsWith("/uploads/")) return true;
  if (pathname.startsWith("/proyectos/")) return true;
  if (pathname === "/robots.txt") return true;
  if (pathname === "/sitemap.xml") return true;
  // Por defecto no bloquear /api (contacto, admin login, etc.). Para proteger APIs también, descomentar:
  // if (pathname.startsWith("/api/")) return false;
  if (pathname.startsWith("/api/")) return true;
  return false;
}

/** Valida credenciales Basic Auth contra env. Usar atob (Edge). */
function validateBasicAuth(authHeader: string | null): boolean {
  const user = process.env.SITE_USER;
  const pass = process.env.SITE_PASS;
  if (!user || !pass) return true; // sin env no bloqueamos

  if (!authHeader || !authHeader.startsWith("Basic ")) return false;
  try {
    const b64 = authHeader.slice(6);
    const decoded = atob(b64);
    const colon = decoded.indexOf(":");
    if (colon === -1) return false;
    const givenUser = decoded.slice(0, colon);
    const givenPass = decoded.slice(colon + 1);
    return givenUser === user && givenPass === pass;
  } catch {
    return false;
  }
}

/** Añade X-Robots-Tag noindex,nofollow cuando el sitio está en modo privado. */
function maybeAddNoIndex(res: NextResponse): NextResponse {
  if (isPrivateMode) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Rutas que siempre pasan (assets, robots, sitemap, api)
  if (isAllowedWithoutAuth(pathname)) {
    return maybeAddNoIndex(NextResponse.next());
  }

  // 2) En modo privado: Basic Auth global (solo si SITE_USER y SITE_PASS están definidos)
  if (isPrivateMode) {
    if (!validateBasicAuth(req.headers.get("authorization"))) {
      const res = new NextResponse("Autenticación requerida", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Sitio en modo privado", charset="UTF-8"',
        },
      });
      return maybeAddNoIndex(res);
    }
  }

  // 3) Galería: no cachear para que siempre muestre fotos actualizadas
  if (pathname === "/galeria") {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    return maybeAddNoIndex(res);
  }

  // 4) Admin: redirigir a login si no hay cookie de sesión
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return maybeAddNoIndex(NextResponse.next());
    const token = req.cookies.get("admin_session")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return maybeAddNoIndex(NextResponse.redirect(url));
    }
  }

  return maybeAddNoIndex(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de página y datos excepto:
     * - _next/static, _next/image, favicon, etc. (manejados por isAllowedWithoutAuth)
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
