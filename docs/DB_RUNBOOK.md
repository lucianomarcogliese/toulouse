# DB Runbook — Toulouse Estudio

Guía operativa para base de datos en desarrollo y producción (Prisma + PostgreSQL).

---

## 1. Esquema y modelos

**Ubicación:** `prisma/schema.prisma`

| Modelo | Descripción | Clave / Índices |
|--------|-------------|------------------|
| **Photo** | Fotos de la galería | `id` (cuid), sin índices adicionales |
| **ContentBlock** | Bloques de texto editables (CMS) | `key` (PK) |
| **AdminUser** | Usuario admin (login) | `id` (cuid), `email` unique |
| **AdminSession** | Sesiones activas (token hasheado) | `id` (cuid), `tokenHash` unique, índice `userId` |
| **ContactMessage** | Mensajes del formulario de contacto | `id` (cuid), índices `status`, `createdAt` |

**Relaciones:**

- `AdminSession.userId` → `AdminUser.id` con `onDelete: Cascade` (al borrar usuario se borran sus sesiones).

**Provider:** PostgreSQL. En desarrollo se puede usar SQLite cambiando `provider` y `DATABASE_URL`; las migraciones en el repo están generadas para Postgres (`migration_lock.toml`).

---

## 2. Aplicar migraciones en producción

Las migraciones están en `prisma/migrations/`. En producción **no** se usa `prisma migrate dev` (eso es para desarrollo y puede resetear datos). Se usa:

```bash
npx prisma migrate deploy
```

**Requisitos:**

- Variable de entorno `DATABASE_URL` apuntando a la base de datos de producción (PostgreSQL).
- Ejecutar desde un entorno donde tengas la URL (local con `.env` de prod, CI, o shell del proveedor).

**Dónde ejecutarlo:**

- **Local contra prod:** En la raíz del proyecto, con `DATABASE_URL` de producción en `.env.production` o exportada:
  ```bash
  cd estudio-interiorismo
  export DATABASE_URL="postgresql://..."   # o cargar desde .env.production
  npx prisma migrate deploy
  ```
- **Vercel / serverless:** Vercel no ejecuta migraciones en el deploy. Hay que correr `prisma migrate deploy` a mano (local con `DATABASE_URL` de prod) o desde un job/script en tu CI después de cada cambio de esquema.
- **Neon / Supabase / Railway:** Suelen ofrecer un shell o “Run command” donde puedes ejecutar el mismo comando con la `DATABASE_URL` del proyecto.

**Ver estado de migraciones:**

```bash
npx prisma migrate status
```

---

## 3. Crear el admin inicial

En producción no existe el endpoint `/api/admin/seed` (responde 404). El admin inicial se crea con el **script** que usa `ADMIN_EMAIL` y `ADMIN_PASSWORD` desde env.

**Requisitos:**

- `DATABASE_URL` apuntando a Postgres (prod o staging).
- `ADMIN_EMAIL` y `ADMIN_PASSWORD` definidos (por ejemplo en `.env.local` o en el entorno donde ejecutes el script).

**Comando:**

```bash
cd estudio-interiorismo
node scripts/create-admin.cjs
```

El script carga `.env.local` (y espera `DATABASE_URL` de Postgres). Para producción, podés:

- Copiar temporalmente la `DATABASE_URL` de prod a `.env.local` y definir ahí `ADMIN_EMAIL` y `ADMIN_PASSWORD`, ejecutar el script y luego no commitear esos valores.
- O exportar las variables en la shell y adaptar el script para leerlas (el script actual usa `process.env` y dotenv desde `.env.local`).

**Idempotencia:** El script comprueba si ya existe un usuario con ese `email`. Si existe, no hace nada y sale con mensaje "Admin ya existe con ese email. Nada que hacer." Podés ejecutarlo varias veces sin duplicar admins.

**Endpoint de seed (solo desarrollo):**  
`POST /api/admin/seed` crea un admin con `ADMIN_EMAIL` y `ADMIN_PASSWORD` solo si `NODE_ENV !== "production"`. Es idempotente: si el admin ya existe, responde `{ ok: true, message: "Admin ya existe" }` sin crear otro.

---

## 4. Backup y restore

### Backup (PostgreSQL)

**Opción 1 — pg_dump (completo):**

```bash
pg_dump "$DATABASE_URL" -F c -f backup_$(date +%Y%m%d_%H%M).dump
```

**Opción 2 — SQL plano:**

```bash
pg_dump "$DATABASE_URL" -f backup_$(date +%Y%m%d_%H%M).sql
```

**Opción 3 — Proveedor gestionado:**  
Neon, Supabase, Vercel Postgres, Railway, etc. suelen ofrecer backups automáticos y/o “Point in time recovery” desde el panel. Revisá la documentación del que uses.

### Restore

**Desde dump custom (formato custom `-F c`):**

```bash
pg_restore -d "$DATABASE_URL" --clean --if-exists backup_YYYYMMDD_HHMM.dump
```

**Desde SQL plano:**

```bash
psql "$DATABASE_URL" -f backup_YYYYMMDD_HHMM.sql
```

**Importante:** Hacer restore sobre una base vacía o de la que tengas backup, porque `--clean` puede borrar objetos existentes.

### Tablas del proyecto (referencia)

- `Photo`
- `ContentBlock`
- `AdminUser`
- `AdminSession`
- `ContactMessage`
- `_prisma_migrations` (control de migraciones de Prisma)

---

## 5. Comandos útiles

| Comando | Uso |
|---------|-----|
| `npx prisma generate` | Regenerar el cliente Prisma (se ejecuta en `npm run build`). |
| `npx prisma migrate deploy` | Aplicar migraciones pendientes en la DB (prod). |
| `npx prisma migrate status` | Ver estado de migraciones. |
| `npx prisma migrate dev` | Solo desarrollo: crear/aplicar migraciones y regenerar cliente. |
| `node scripts/create-admin.cjs` | Crear admin inicial (idempotente). |

---

## 6. Resumen de idempotencia

- **Migraciones:** `prisma migrate deploy` es idempotente: solo aplica migraciones que aún no están en `_prisma_migrations`.
- **Admin:** Tanto el script `create-admin.cjs` como el endpoint `/api/admin/seed` (dev) comprueban si ya existe un usuario con el mismo email antes de crear; no crean duplicados.

---

*Última actualización: validación 3 — Integridad DB y Prisma.*
