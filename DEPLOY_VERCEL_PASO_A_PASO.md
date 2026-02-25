# Deploy a Vercel – Paso a paso (Toulouse Estudio)

Seguí estos pasos en orden.

---

## PASO 1 — Subir el código a GitHub

1. Si todavía no tenés el repo en GitHub:
   - Creá un repositorio nuevo en [github.com](https://github.com/new).
   - En la carpeta del proyecto (donde está `package.json`):
     ```bash
     git init
     git add .
     git commit -m "Initial commit - Next.js + Prisma + Cloudinary"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
     git push -u origin main
     ```
2. Si ya tenés repo: asegurate de que los últimos cambios (incluyendo `prisma/migrations`) estén subidos:
   ```bash
   git add .
   git commit -m "Pre-deploy: Cloudinary, sortOrder, contact"
   git push
   ```

---

## PASO 2 — Crear la base de datos PostgreSQL

1. Entrá a uno de estos (gratis para empezar):
   - **[Neon](https://neon.tech)** – recomendado, Postgres serverless.
   - **[Supabase](https://supabase.com)** – Postgres + extras.
   - **[Vercel Postgres](https://vercel.com/storage/postgres)** – integrado con Vercel.
2. Creá un proyecto / base de datos.
3. Copiá la **connection string** (URL de conexión). Se ve así:
   ```text
   postgresql://usuario:contraseña@host.region.aws.neon.tech/nombre_db?sslmode=require
   ```
4. Guardala; la vas a usar en el Paso 4 como `DATABASE_URL`.

---

## PASO 3 — Crear el proyecto en Vercel

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión (con GitHub si podés).
2. Clic en **"Add New…"** → **"Project"**.
3. **Import** el repositorio de GitHub (conectá GitHub si te lo pide).
4. Configuración del proyecto:
   - **Framework Preset**: Next.js (debería detectarlo).
   - **Root Directory**: si tu código está dentro de una carpeta (ej. `estudio-interiorismo`), elegí esa carpeta. Si el repo es directamente el proyecto, dejalo vacío.
   - **Build Command**: `npm run build` (por defecto).
   - **Output Directory**: por defecto.
5. **No hagas deploy todavía.** Clic en **"Environment Variables"** (o configurá las variables antes del primer deploy).

---

## PASO 4 — Variables de entorno en Vercel

En el proyecto en Vercel: **Settings** → **Environment Variables**.

Agregá estas variables. Marcá al menos **Production** (y Preview si querés).

| Nombre | Valor | Notas |
|--------|--------|--------|
| `DATABASE_URL` | La URL de Postgres del Paso 2 | Connection string tal cual |
| `SESSION_SECRET` | String largo aleatorio | Ej: generá con `openssl rand -hex 32` en una terminal |
| `RESEND_API_KEY` | Tu API key de Resend | Dashboard de [resend.com](https://resend.com) |
| `CLOUDINARY_CLOUD_NAME` | Tu cloud name | Dashboard de [cloudinary.com](https://cloudinary.com) |
| `CLOUDINARY_API_KEY` | Tu API key | Mismo dashboard |
| `CLOUDINARY_API_SECRET` | Tu API secret | Mismo dashboard |
| `CLOUDINARY_FOLDER` | `toulouse` | Opcional; por defecto es `toulouse` |

- Para **SESSION_SECRET** en Windows: podés usar una cadena larga aleatoria de [randomkeygen.com](https://randomkeygen.com) (Code Key) o en PowerShell:
  ```powershell
  -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
  ```
- Guardá cada variable. No uses comillas en el valor salvo que Vercel lo indique.

---

## PASO 5 — Primer deploy

1. En Vercel, **Deployments** → **"Redeploy"** del último deploy, o hacé un **push** a la rama conectada (ej. `main`) para que se dispare el deploy.
2. Esperá a que termine el build. Si falla:
   - Revisá que **Root Directory** sea correcto.
   - Revisá que las 3 variables obligatorias estén bien (`DATABASE_URL`, `SESSION_SECRET`, `RESEND_API_KEY`).
3. Cuando el deploy esté **Ready**, abrí la URL (ej. `https://tu-proyecto.vercel.app`).

---

## PASO 6 — Aplicar migraciones en la base de producción

Las tablas se crean con las migraciones de Prisma. Hay que ejecutarlas **una vez** contra la DB de producción.

**Desde tu máquina (recomendado)**

1. En la carpeta del proyecto, asegurate de tener la URL de producción. Podés:
   - Crear un archivo `.env.production` solo con `DATABASE_URL="..."` (no lo subas a Git), o
   - Exportar la variable en la terminal solo para este comando.
2. En la terminal:
   ```bash
   cd estudio-interiorismo
   set DATABASE_URL=postgresql://...tu_url_de_produccion...
   npx prisma migrate deploy
   ```
   (En PowerShell: `$env:DATABASE_URL="postgresql://..."; npx prisma migrate deploy`)
3. Deberías ver: "All migrations have been successfully applied."

---

## PASO 7 — Crear el usuario admin (primera vez)

En producción, `/api/admin/seed` **no está disponible** (devuelve 404). Tenés que crear el admin a mano.

**Opción práctica: desde desarrollo (temporal)**

1. En **local**, en `.env.local` poné **temporalmente**:
   - `DATABASE_URL` = URL de la base de **producción** (Postgres).
   - `ADMIN_EMAIL` = email con el que querés entrar al admin.
   - `ADMIN_PASSWORD` = contraseña en texto plano (se hashea al crear el usuario).
2. Arrancá `npm run dev`.
3. Hacé un **POST** a `http://localhost:3000/api/admin/seed` (en dev la ruta existe y usa `ADMIN_EMAIL` y `ADMIN_PASSWORD` de `.env.local`). Podés usar el navegador con una extensión para POST, o:
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed
   ```
4. Verificá en el dashboard de tu base de producción (Neon/Supabase) que exista un registro en la tabla `AdminUser`.
5. **Volvé** `DATABASE_URL` en `.env.local` a tu base local (ej. `file:./dev.db`).

**Alternativa:** script que use Prisma + bcrypt para insertar un `AdminUser` con el mismo formato que el seed, ejecutado una vez con `DATABASE_URL` de producción.

---

## PASO 8 — Probar en producción

1. **Sitio**: Abrí `https://tu-dominio.vercel.app` y navegá (inicio, galería, contacto).
2. **Admin**: Entrá a `https://tu-dominio.vercel.app/admin/login` e iniciá sesión con el admin que creaste.
3. **Fotos**: En Admin · Fotos subí una imagen. Debería guardarse en Cloudinary y verse en la galería.
4. **Contacto**: Enviá un mensaje de prueba y revisá que llegue el mail (Resend) y/o que se guarde en la base.

---

## Resumen rápido

| # | Acción |
|---|--------|
| 1 | Código en GitHub (con `prisma/migrations`) |
| 2 | Postgres en Neon/Supabase/Vercel Postgres → copiar `DATABASE_URL` |
| 3 | Proyecto en Vercel, importar repo, Root Directory correcto |
| 4 | Variables: `DATABASE_URL`, `SESSION_SECRET`, `RESEND_API_KEY`, `CLOUDINARY_*` |
| 5 | Deploy (Redeploy o push a `main`) |
| 6 | `npx prisma migrate deploy` con `DATABASE_URL` de producción |
| 7 | Crear usuario admin (seed en local con DB prod, o script) |
| 8 | Probar login admin, fotos con Cloudinary y formulario de contacto |

Si algo falla, revisá los **logs** en Vercel (Deployments → el deploy → Building / Function Logs) y que las variables no tengan espacios de más.
