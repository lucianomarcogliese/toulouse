import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Galería: no cachear para que siempre muestre fotos actualizadas
  if (pathname === "/galeria") {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    return res;
  }

  // Solo afecta admin
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Ruta pública
  if (pathname === "/admin/login") return NextResponse.next();

  // Si no hay cookie de sesión, afuera
  const token = req.cookies.get("admin_session")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/galeria", "/admin/:path*"],
};