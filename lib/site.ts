/**
 * URL base del sitio (producción: dominio real; dev: localhost).
 * Usado en metadataBase, sitemap y robots.
 * Prioridad: NEXT_PUBLIC_SITE_URL → en prod dominio final → VERCEL_URL → localhost.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NODE_ENV === "production") return "https://toulousedesign.com";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
