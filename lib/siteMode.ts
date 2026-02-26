/**
 * Modo global del sitio (variable de entorno).
 * - private: Basic Auth activo + no indexable (X-Robots-Tag, robots Disallow /)
 * - public:  Sin protección + indexable SEO
 *
 * NEXT_PUBLIC_ permite leer el valor en Edge (middleware) y en robots.ts.
 * Requiere redeploy para aplicar cambios.
 */
export const isPrivateMode = process.env.NEXT_PUBLIC_SITE_MODE === "private";
