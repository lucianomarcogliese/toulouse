/**
 * Mapa de keys del CMS (ContentBlock).
 * Usado en /admin/textos para listar y editar, y en páginas con pick(map, key, fallback).
 */

export type ContentKeySpec = {
  key: string;
  label: string;
  help?: string;
  multiline?: boolean;
};

export const CONTENT_KEY_SPECS: ContentKeySpec[] = [
  // HOME
  { key: "home.title", label: "Home · Título", help: "Título principal del hero." },
  { key: "home.subtitle", label: "Home · Subtítulo", help: "Texto debajo del título.", multiline: true },
  { key: "home.heroImage", label: "Home · Imagen principal", help: "Ruta: /uploads/xxx.jpg o /proyectos/01.jpeg" },

  // SERVICIOS
  { key: "services.title", label: "Servicios · Título" },
  { key: "services.subtitle", label: "Servicios · Subtítulo", multiline: true },
  { key: "services.1.title", label: "Servicios · (1) Título" },
  { key: "services.1.desc", label: "Servicios · (1) Descripción", multiline: true },
  { key: "services.2.title", label: "Servicios · (2) Título" },
  { key: "services.2.desc", label: "Servicios · (2) Descripción", multiline: true },
  { key: "services.3.title", label: "Servicios · (3) Título" },
  { key: "services.3.desc", label: "Servicios · (3) Descripción", multiline: true },
  { key: "services.4.title", label: "Servicios · (4) Título" },
  { key: "services.4.desc", label: "Servicios · (4) Descripción", multiline: true },

  // DESTACADOS (HOME)
  { key: "featured.title", label: "Destacados · Título" },
  { key: "featured.subtitle", label: "Destacados · Subtítulo", multiline: true },

  // SOBRE
  { key: "about.title", label: "Sobre · Título" },
  { key: "about.text", label: "Sobre · Texto principal", multiline: true },
  { key: "about.enfoque.title", label: "Sobre · Enfoque · Título" },
  { key: "about.enfoque.subtitle", label: "Sobre · Enfoque · Subtítulo", multiline: true },
  { key: "about.values.1.title", label: "Sobre · Valores (1) · Título" },
  { key: "about.values.1.body", label: "Sobre · Valores (1) · Texto", multiline: true },
  { key: "about.values.2.title", label: "Sobre · Valores (2) · Título" },
  { key: "about.values.2.body", label: "Sobre · Valores (2) · Texto", multiline: true },
  { key: "about.values.3.title", label: "Sobre · Valores (3) · Título" },
  { key: "about.values.3.body", label: "Sobre · Valores (3) · Texto", multiline: true },
  { key: "about.proceso.title", label: "Sobre · Proceso · Título" },
  { key: "about.proceso.subtitle", label: "Sobre · Proceso · Subtítulo", multiline: true },
  { key: "about.process.1.step", label: "Sobre · Proceso (1) · Paso", help: "Ej: 01" },
  { key: "about.process.1.title", label: "Sobre · Proceso (1) · Título" },
  { key: "about.process.1.body", label: "Sobre · Proceso (1) · Texto", multiline: true },
  { key: "about.process.2.step", label: "Sobre · Proceso (2) · Paso", help: "Ej: 02" },
  { key: "about.process.2.title", label: "Sobre · Proceso (2) · Título" },
  { key: "about.process.2.body", label: "Sobre · Proceso (2) · Texto", multiline: true },
  { key: "about.process.3.step", label: "Sobre · Proceso (3) · Paso", help: "Ej: 03" },
  { key: "about.process.3.title", label: "Sobre · Proceso (3) · Título" },
  { key: "about.process.3.body", label: "Sobre · Proceso (3) · Texto", multiline: true },
  { key: "about.process.4.step", label: "Sobre · Proceso (4) · Paso", help: "Ej: 04" },
  { key: "about.process.4.title", label: "Sobre · Proceso (4) · Título" },
  { key: "about.process.4.body", label: "Sobre · Proceso (4) · Texto", multiline: true },
  { key: "about.cta.title", label: "Sobre · CTA · Título" },
  { key: "about.cta.text", label: "Sobre · CTA · Texto", multiline: true },
  { key: "about.cta.button", label: "Sobre · CTA · Botón" },

  // CONTACTO
  { key: "contact.title", label: "Contacto · Título" },
  { key: "contact.text", label: "Contacto · Texto principal", multiline: true },
  { key: "contact.card.title", label: "Contacto · Tarjeta · Título" },
  { key: "contact.card.text", label: "Contacto · Tarjeta · Texto", multiline: true },
  { key: "contact.email", label: "Contacto · Email", help: "Ej: hola@toulouse.com" },
  { key: "contact.whatsapp", label: "Contacto · WhatsApp", help: "Ej: 5491112345678 (solo números)" },
  { key: "contact.whatsappMessage", label: "Contacto · Mensaje WhatsApp", multiline: true },
  { key: "contact.hours.title", label: "Contacto · Horario · Título" },
  { key: "contact.hours.text", label: "Contacto · Horario · Texto", help: "Ej: Lun a Vie · 10:00 a 18:00" },
  { key: "contact.location.title", label: "Contacto · Ubicación · Título" },
  { key: "contact.location.text", label: "Contacto · Ubicación · Texto", multiline: true },
  { key: "contact.location.note", label: "Contacto · Ubicación · Nota", help: "Ej: Atención con cita previa." },
];
