# SEO y previews — Toulouse Estudio

Resumen de la configuración SEO y de previsualización (Open Graph, Twitter, sitemap, robots).

---

## 1. Metadata global (`app/layout.tsx`)

- **metadataBase:** URL base del sitio (`NEXT_PUBLIC_SITE_URL`, o `https://${VERCEL_URL}` en Vercel, o `http://localhost:3000` en dev). Todas las URLs relativas de metadata se resuelven contra esta base.
- **title:** Por defecto `"TOULOUSE — Diseño de interiores"`. **template:** `"%s | TOULOUSE — Diseño de interiores"` para páginas hijas.
- **description:** Descripción por defecto del estudio (proyectos residenciales y comerciales, estética atemporal).
- **icons:** `icon: "/favicon.ico"`.
- **openGraph:** `type: "website"`, `locale: "es_ES"`, `siteName`, `title`, `description`, `url: "/"`, `images`: una entrada apuntando a **`/opengraph-image`** (1200×630, alt definido).
- **twitter:** `card: "summary_large_image"`, `title`, `description`, `images: ["/opengraph-image"]`.
- **alternates:** `canonical: "/"` por defecto (las páginas hijas sobrescriben con su ruta).

---

## 2. Metadata por página

| Ruta | title | description | canonical |
|------|--------|-------------|-----------|
| `/` | Inicio | Estudio con calma y carácter… | `/` |
| `/galeria` | Galería | Proyectos del estudio… | `/galeria` |
| `/servicios` | Servicios | Diseño integral, planificación… | `/servicios` |
| `/sobre` | Sobre nosotros | Enfocado en espacios serenos… | `/sobre` |
| `/contacto` | Contacto | Contactá al estudio… | `/contacto` |

Cada página exporta `metadata` con `title`, `description`, `alternates.canonical` y `openGraph.title` / `openGraph.description`. La imagen OG se hereda del layout (`/opengraph-image`).

---

## 3. Sitemap y robots

**Sitemap**

- **Archivo:** `app/sitemap.ts`
- **URL:** **`/sitemap.xml`** (Next.js la sirve automáticamente).
- **Contenido:** Rutas estáticas: `/`, `/galeria`, `/servicios`, `/sobre`, `/contacto` con `lastModified`, `changeFrequency` y `priority`.
- **Base URL:** La misma que `getBaseUrl()` (`lib/site.ts`), así que en producción el sitemap usa el dominio real.

**Robots**

- **Archivo:** `app/robots.ts`
- **URL:** **`/robots.txt`** (Next.js la sirve automáticamente).
- **Reglas:** `Allow: /`, `Disallow: /admin/`, `Disallow: /api/`.
- **Sitemap:** `{base}/sitemap.xml`.

Para comprobar en local: `http://localhost:3000/sitemap.xml` y `http://localhost:3000/robots.txt`. En producción, usar la URL real del sitio.

---

## 4. Imagen OG (Open Graph)

- **Origen:** Imagen generada por código en **`app/opengraph-image.tsx`** (Next.js ImageResponse, 1200×630, PNG).
- **URL pública:** **`/opengraph-image`** (sin extensión).
- **Uso:** El layout ya la referencia en `metadata.openGraph.images` y `metadata.twitter.images`. Todas las páginas que no definen su propia imagen OG usan esta por defecto.
- **Alt:** Definido en `app/opengraph-image.alt.txt`: "Toulouse — Diseño de interiores".

**Opción estática:** Si querés una imagen fija (p. ej. para redes que cachean mucho), podés añadir **`public/og.png`** (1200×630 px) y agregar una segunda entrada en `metadata.openGraph.images` en `layout.tsx` con `url: "/og.png"`. La ruta dinámica `/opengraph-image` puede seguir siendo la primera opción.

---

## 5. Checklist rápido

- [ ] `metadataBase` definido y correcto en producción (env `NEXT_PUBLIC_SITE_URL` o Vercel).
- [ ] Todas las páginas públicas tienen `title`, `description` y `canonical`.
- [ ] `/sitemap.xml` responde con las URLs correctas.
- [ ] `/robots.txt` responde con allow/disallow y enlace al sitemap.
- [ ] `/opengraph-image` responde 200 y se ve bien en depuración (p. ej. Facebook Sharing Debugger o similar).

---

*Última actualización: validación 5 — SEO final.*
