/**
 * Genera un alt descriptivo para SEO.
 * Si el título es largo y no genérico, se usa; si no, descripción con categoría.
 */
export function getPhotoAlt(photo: { title: string; category: string }): string {
  const t = photo.title.trim();
  const generic = /^(imagen|foto|photo|img)\s*\d*$/i.test(t);
  if (t.length >= 15 && !generic) return t;
  return `Proyecto de interiorismo ${photo.category} — Toulouse Design Zona Norte`;
}
