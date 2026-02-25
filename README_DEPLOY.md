# Deploy a producción (Vercel) – Toulouse Estudio

Proyecto: **Next.js App Router + Prisma**  
Entorno local: **SQLite** (archivo)  
Producción recomendada: **PostgreSQL** (Neon, Supabase, Vercel Postgres, Railway, etc.)

---

## Variables de entorno necesarias

Configúralas en:

- **Desarrollo**: archivo `.env.local` en la raíz del proyecto `estudio-interiorismo`
- **Producción (Vercel u otro)**: apartado **Environment Variables** del proyecto

**Críticas (la app falla si no están):**

- **`DATABASE_URL`**
  - Dev (SQLite): por ejemplo `file:./dev.db`
  - Prod (Postgres): por ejemplo `postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public`
- **`RESEND_API_KEY`**
  - API key de Resend para `/api/contact`
- **`SESSION_SECRET`**
  - String largo y aleatorio para firmar los tokens de sesión admin

**Opcionales pero recomendadas:**

- **`ADMIN_EMAIL`**
  - Email del usuario admin inicial (solo se usa en la ruta `/api/admin/seed` en desarrollo)
- **`ADMIN_PASSWORD`**
  - Password en texto plano que se hashea al crear el admin desde `/api/admin/seed` (solo dev)

**Para producción: imágenes en Cloudinary**

En Vercel el sistema de archivos es **efímero**, por lo que subir imágenes a `/public/uploads` no es persistente. Para que el panel de fotos funcione en producción, configurá Cloudinary.

**Recomendado (upload sin firma – evita errores "Invalid Signature"):**

- **`CLOUDINARY_CLOUD_NAME`** – Nombre de tu cloud en el dashboard de Cloudinary  
- **`CLOUDINARY_API_KEY`** – API key  
- **`CLOUDINARY_UPLOAD_PRESET`** – Nombre de un **Upload preset unsigned** (crealo en Cloudinary: **Settings → Upload → Upload presets → Add upload preset → Signing Mode: Unsigned**)

Con estas tres variables, las subidas usan el preset y **no** requieren API Secret. Para que el admin pueda **eliminar** fotos también en Cloudinary, agregá:

- **`CLOUDINARY_API_SECRET`** – API secret de la misma cuenta (solo se usa para borrar assets)

**Alternativa (upload firmado):** Si no definís `CLOUDINARY_UPLOAD_PRESET`, la app usa upload firmado con `CLOUDINARY_API_SECRET`. Cualquier error de secret o entorno suele dar "Invalid Signature" en producción; por eso se recomienda usar el preset unsigned.

- **`CLOUDINARY_FOLDER`** (opcional) – Carpeta donde se guardan las imágenes; por defecto `toulouse`

Si **ninguna** variable de Cloudinary está definida, la ruta `/api/admin/upload` guarda en **`/public/uploads`** (solo válido en desarrollo local; en Vercel se pierde en cada deploy).

**Comportamiento dev vs prod**

| Aspecto | Desarrollo | Producción (Vercel) |
|--------|------------|----------------------|
| **Upload** | Si hay vars Cloudinary → Cloudinary; si no → `public/uploads` | Debe usarse Cloudinary (vars configuradas). Sin ellas, los archivos irían a disco efímero y se pierden. |
| **Respuesta upload** | `{ ok: true, url, publicId }` (Cloudinary) o `{ ok: true, url, publicId: null }` (local) | `{ ok: true, url, publicId }` desde Cloudinary. |
| **Límites** | Máx. 8 MB por archivo. Solo JPEG, PNG o WebP. | Igual. |
| **Borrar foto** | Si tiene `cloudinaryId` → se borra en Cloudinary (si hay API Secret). Si `src` es `/uploads/...` → se borra el archivo local. | Siempre con Cloudinary: se borra el registro en DB y el asset en Cloudinary (con `CLOUDINARY_API_SECRET`). No se usa `/uploads` en prod. |
| **Imágenes en el sitio** | `next/image` sirve URLs de `res.cloudinary.com` (configurado en `next.config.ts` con `remotePatterns`). | Igual. |

> El módulo `lib/env.ts` valida en runtime las variables críticas del servidor y lanza errores claros si faltan.

---

## Cómo probar (uploads y Cloudinary)

### 1. Local sin Cloudinary (fallback a `/public/uploads`)

- **No** definas `CLOUDINARY_*` en `.env.local`.
- Arranca: `npm run dev`.
- Entra a `/admin/login`, inicia sesión y ve a **Admin · Fotos**.
- Sube una imagen (título, categoría, “Guardar”). Debe guardarse en `public/uploads/` y la foto debe aparecer en la lista y en la galería (`/galeria`).
- Elimina esa foto: debe borrarse de la DB y el archivo de `public/uploads/` debe desaparecer.

### 2. Local con Cloudinary

- Creá una cuenta en [cloudinary.com](https://cloudinary.com) y en el Dashboard anotá **Cloud name**, **API Key** y **API Secret**.
- **Opción A – Con preset (recomendado, mismo flujo que en Vercel):** En `.env.local`:
  ```
  CLOUDINARY_CLOUD_NAME=tu-cloud-name
  CLOUDINARY_API_KEY=tu-api-key
  CLOUDINARY_UPLOAD_PRESET=nombre-del-preset-unsigned
  CLOUDINARY_FOLDER=toulouse
  ```
  Creá el preset en Cloudinary: **Settings → Upload → Upload presets → Add upload preset → Signing Mode: Unsigned**.
- **Opción B – Sin preset (upload firmado):** En `.env.local`:
  ```
  CLOUDINARY_CLOUD_NAME=tu-cloud-name
  CLOUDINARY_API_KEY=tu-api-key
  CLOUDINARY_API_SECRET=tu-api-secret
  CLOUDINARY_FOLDER=toulouse
  ```
- Reiniciá el servidor (`npm run dev`).
- En **Admin · Fotos**, subí una imagen. En el Dashboard de Cloudinary (Media Library) debe aparecer en la carpeta `toulouse`.
- Abrí `/galeria`: la imagen debe verse con `next/image` (URL de `res.cloudinary.com`).
- Eliminá la foto desde el admin: si tenés `CLOUDINARY_API_SECRET` configurado, en Cloudinary el asset debe desaparecer de la Media Library.

### 3. Build de producción

```bash
npm run build
```

Si termina sin errores, el proyecto está listo para deploy. En Vercel configura las mismas variables de Cloudinary para que los uploads en producción vayan a Cloudinary.

---

## Pasos para deploy en Vercel

### 1. Preparar base de datos de producción

1. Crea una base de datos **PostgreSQL** en tu proveedor favorito (Neon, Supabase, Vercel Postgres, etc.).  
2. Copia la URL de conexión (connection string) y guárdala para el paso de variables de entorno.
3. Asegúrate de que la base permite conexiones desde Vercel (IP allowlist / SSL según proveedor).

### 2. Crear proyecto en Vercel

1. Sube este repo a GitHub/GitLab/Bitbucket (la carpeta `estudio-interiorismo` debe ser el proyecto).  
2. En Vercel, haz **"New Project"** y selecciona el repositorio.  
3. En "Root Directory", si es necesario, apunta a `estudio-interiorismo`.  
4. Deja el framework como **Next.js** con ajustes por defecto (App Router).

### 3. Configurar variables de entorno en Vercel

En la pestaña **Settings → Environment Variables** del proyecto en Vercel, crea:

- `DATABASE_URL` → URL de Postgres de producción.
- `RESEND_API_KEY` → API key de Resend (Producción).
- `SESSION_SECRET` → string largo y aleatorio (puedes generar con `openssl rand -hex 32` o similar).
- **Cloudinary** (para que el panel de fotos suba y sirva imágenes en producción):
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - **`CLOUDINARY_UPLOAD_PRESET`** → nombre del preset **unsigned** (recomendado; evita Invalid Signature)
  - `CLOUDINARY_API_SECRET` → necesario si querés que al borrar una foto desde el admin también se elimine en Cloudinary
  - (Opcional) `CLOUDINARY_FOLDER` → por ejemplo `toulouse`
- (Opcional) `ADMIN_EMAIL` y `ADMIN_PASSWORD` → solo si vas a reutilizar la ruta de seed en dev; en prod la ruta se desactiva por seguridad.

Marca estas variables al menos para los entornos **Production** (y opcionalmente Preview/Development si los usas desde Vercel).

### 4. Build & deploy

Con el repo conectado y las env vars configuradas:

1. Vercel ejecutará automáticamente:
   - `npm install`
   - `npm run build`
   - y luego lanzará el deploy.
2. Si el build pasa, tendrás una **Preview** o directamente el **Production Deploy** (según la rama).

Puedes simular esto en local antes de subir:

```bash
cd estudio-interiorismo
npm install
npm run build
```

Si `npm run build` falla, revisa las variables de entorno requeridas (`RESEND_API_KEY`, `SESSION_SECRET`, `DATABASE_URL`).

---

## Migraciones y seed en producción

Para pasos detallados (comandos, crear admin, backup/restore) ver **`docs/DB_RUNBOOK.md`**.

### Migraciones (Prisma)

En producción debes aplicar las migraciones Prisma sobre la base de datos Postgres.

Flujo típico:

1. Localmente, genera y prueba migraciones:
   ```bash
   # desarrollo (con tu .env.local apuntando a SQLite o Postgres de dev)
   npx prisma migrate dev
   ```
2. Una vez satisfecho con el esquema, sube los cambios al repo (incluyendo `prisma/migrations`).  
3. En producción, aplica migraciones sobre la DB de prod con:
   ```bash
   npx prisma migrate deploy
   ```

   Opciones para ejecutarlo en producción:

   - **Shell/CLI de tu proveedor** (Neon, Supabase, etc.) si lo permite, con el código del proyecto desplegado.
   - **Script manual**: crear un pequeño script Node o comando que llame a `prisma migrate deploy` y ejecutarlo una sola vez en un entorno con `DATABASE_URL` apuntando a la DB de producción.

> No hay script automático de migraciones configurado en `package.json` para producción; se recomienda aplicar las migraciones de forma controlada cuando cambies el esquema.

### Seed (crear usuario admin)

La ruta `/api/admin/seed`:

- **Solo funciona si `NODE_ENV !== "production"`** (en producción devuelve 404 `"No disponible"`).
- Usa `ADMIN_EMAIL` y `ADMIN_PASSWORD` para crear un usuario admin con contraseña hasheada.

Recomendación para producción:

- **No** usar un endpoint público de seed.  
- Crear el admin de una de estas formas:
  - Insert directo en la base de datos (SQL) usando la misma estructura que Prisma (`AdminUser` con `passwordHash` bcrypt).
  - Script único de seed ejecutado en un entorno seguro (no expuesto públicamente).

---

## Consideraciones de base de datos (SQLite vs Postgres)

En desarrollo, la app usa **SQLite** porque es simple y no requiere servidor externo:

- El datasource en `prisma/schema.prisma` apunta a `env("DATABASE_URL")`, que en dev suele ser `file:./dev.db`.

En producción (Vercel o entornos serverless similares), **SQLite no es ideal** porque:

- El sistema de archivos es **efímero** y se resetea en cada deploy.
- No escala bien con múltiples instancias/concurrencia.
- Riesgo alto de corrupción o pérdida de datos entre despliegues.

Por eso, en producción se recomienda:

- Usar una base **PostgreSQL** gestionada.
- Configurar `DATABASE_URL` con la URL de Postgres.
- Ejecutar migraciones Prisma (`prisma migrate deploy`) contra esa base.

---

## Checklist de producción

Usa esta lista rápida antes de considerar el deploy “listo para clientes reales”:

- **Variables de entorno**
  - **`DATABASE_URL`** apunta a Postgres de producción (no a SQLite).
  - **`SESSION_SECRET`** es un valor largo, aleatorio y privado.
  - **`RESEND_API_KEY`** es la key de producción (no la de test si vas a enviar mails reales).
  - No hay secretos hardcodeados en el código (solo leídos desde `env`).

- **Cookies y auth admin**
  - La cookie `admin_session` se setea con:
    - `httpOnly: true`
    - `secure: env.NODE_ENV === "production"` → en prod viaja solo por HTTPS.
    - `sameSite: "lax"` y `path: "/"`.
  - La validación de sesión (`requireAdmin`) usa tokens hasheados con `SESSION_SECRET`.
  - No hay lógica de login/seed accesible públicamente sin control (seed desactivado en producción).

- **Rutas con acceso a DB/FS/crypto**
  - Todas las rutas admin bajo `/api/admin/*` que usan Prisma, FS o `crypto` declaran:
    - `export const runtime = "nodejs";`
  - La ruta `/api/contact` también usa `runtime = "nodejs"` para funcionar bien con el SDK de Resend.

- **Uso de `env` (server-only)**
  - `lib/env.ts` se usa solo en **código de servidor** (rutas API, libs usadas por el server).
  - No se importa `env` en componentes `client` ni en código que corre en el navegador.
  - Si falta una variable crítica (`RESEND_API_KEY`, `SESSION_SECRET`, `DATABASE_URL`), el servidor lanza errores claros.

- **Build & logs**
  - `npm run build` pasa localmente sin errores.
  - Has probado:
    - Login/logout admin.
    - CRUD de fotos/textos en el panel.
    - Formulario de contacto `/api/contact` (idealmente con una API key de test).
  - Revisaste los logs de Vercel tras el primer deploy por si hay errores de env o DB.

- **Imágenes (Cloudinary en producción)**
  - En producción, configurá **`CLOUDINARY_UPLOAD_PRESET`** (preset unsigned) junto con `CLOUDINARY_CLOUD_NAME` y `CLOUDINARY_API_KEY` para que las subidas funcionen sin errores de firma. Opcionalmente `CLOUDINARY_API_SECRET` para poder eliminar fotos también en Cloudinary.
  - La galería usa `next/image` con `remotePatterns` para `res.cloudinary.com`; las URLs de Cloudinary se muestran sin errores.

- **QA manual**
  - Checklist paso a paso en **`docs/QA_CHECKLIST.md`** (Home, Galería, Sobre, Servicios, Contacto, Admin, formulario de contacto, rate limit, honeypot).

- **SEO y previews**
  - Metadata global y por página, sitemap, robots y imagen OG documentados en **`docs/SEO_NOTES.md`**. Verificar en producción `/sitemap.xml`, `/robots.txt` y `/opengraph-image`.

Con todo esto en verde, el proyecto queda listo para funcionar de forma estable en Vercel (u otra plataforma similar) en un entorno de producción.

---

## Limitaciones y notas

- **Middleware:** Next.js puede mostrar un aviso de deprecación del archivo `middleware` en favor de "proxy". El proyecto sigue funcionando con la convención actual hasta que se migre.
- **Lint:** La carpeta `scripts/` está excluida de ESLint (p. ej. `scripts/create-admin.cjs` usa `require` por compatibilidad con Node directo).
- **Rate limit de contacto:** Implementado en memoria por proceso. En Vercel (serverless) cada instancia tiene su propio contador; para un límite global estricto haría falta un almacén externo (Redis, etc.).
