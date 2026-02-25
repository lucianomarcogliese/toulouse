# Notas de seguridad — Admin y API

Documento de auditoría de seguridad del área `/api/admin/*` y medidas implementadas.

---

## 1. Rutas bajo `app/api/admin` — Revisión

| Ruta | Método | requireAdmin | runtime | 401 cuando no autenticado | Notas |
|------|--------|--------------|---------|---------------------------|--------|
| `/api/admin/login` | POST | No (es login) | nodejs | N/A | Rate limit por IP (10 intentos / 10 min). Mensaje genérico en 401/429. |
| `/api/admin/logout` | POST | No | nodejs | N/A | Invalida sesión en DB y borra cookie. No requiere estar logueado. |
| `/api/admin/seed` | POST | No | nodejs | N/A | Solo en desarrollo; en producción responde 404 "No disponible". |
| `/api/admin/upload` | POST | Sí | nodejs | Sí (`{ ok: false, error: "No autorizado" }`) | Subida de archivos a Cloudinary o `/public/uploads`. |
| `/api/admin/photos` | GET, POST | Sí (en ambos) | nodejs | Sí | Listado y creación de fotos. |
| `/api/admin/photos/[id]` | PATCH, DELETE | Sí (en ambos) | nodejs | Sí | Edición y borrado de foto (y en Cloudinary si aplica). |
| `/api/admin/photos/[id]/featured` | PATCH | Sí | nodejs | Sí | Marcar/desmarcar destacada. |
| `/api/admin/photos/[id]/reorder` | PATCH | Sí | nodejs | Sí | Reordenar fotos. |
| `/api/admin/content` | GET, POST | Sí (en ambos) | nodejs | Sí | Bloques de contenido editables. |
| `/api/admin/messages` | GET | Sí | nodejs | Sí | Listado de mensajes de contacto. |
| `/api/admin/messages/[id]` | GET, PATCH | Sí (en ambos) | nodejs | Sí | Detalle y cambio de estado (new/read). |

**Resumen:**

- Todas las rutas que usan Prisma, `crypto`, `fs` o cookies tienen `export const runtime = "nodejs"`.
- Todas las rutas protegidas llaman a `requireAdmin()` al inicio y devuelven `401` con `{ ok: false, error: "No autorizado" }` si `!auth.ok`.
- Login y seed no usan `requireAdmin` por diseño. Logout no lo requiere (cualquiera puede llamar para limpiar cookie).

---

## 2. Rate limit en `/api/admin/login`

- **Implementado en:** `lib/rateLimit.ts` (`checkLoginRateLimit`) y `app/api/admin/login/route.ts`.
- **Criterio:** Por IP (`x-forwarded-for` si existe, sino `x-real-ip`, sino `"unknown"`).
- **Límite:** 10 intentos por 10 minutos por IP.
- **Comportamiento:** Antes de validar credenciales se comprueba el límite. Si se excede, se responde **429** con:
  - `{ ok: false, error: "Demasiados intentos. Probá en unos minutos." }`
- No se revela si el email existe ni información sensible; el mensaje es genérico.
- Cada intento (éxito o fallo) cuenta para el límite.

---

## 3. Cookies de sesión admin

**Al hacer login (`/api/admin/login`):**

- **Nombre:** `admin_session`
- **Valor:** Token aleatorio (32 bytes hex); en DB se guarda solo el hash HMAC-SHA256.
- **Opciones:**
  - `httpOnly: true` — no accesible desde JavaScript.
  - `secure: env.NODE_ENV === "production"` — solo HTTPS en producción.
  - `sameSite: "lax"` — protección básica CSRF.
  - `path: "/"` — válida para todo el sitio.
  - `expires: expiresAt` — 7 días desde el login.

**Al hacer logout (`/api/admin/logout`):**

- Se busca la sesión en DB por el hash del token y se elimina (`deleteMany`). El token deja de ser válido.
- Se setea la cookie con el mismo nombre, valor vacío, `maxAge: 0` y `expires: new Date(0)` para borrarla en el cliente.
- Mismas opciones de seguridad: `httpOnly`, `secure` en prod, `sameSite: "lax"`, `path: "/"`.

**Validación de sesión (`lib/requireAdmin` + `lib/auth`):**

- Se lee la cookie `admin_session`, se hashea el token y se busca en `AdminSession`.
- Se comprueba que la sesión exista y que `expiresAt` sea mayor que ahora; si no, se considera no autenticado.

---

## 4. Otras medidas

- **Passwords:** Solo se guarda hash bcrypt en `AdminUser.passwordHash`. No se exponen en respuestas.
- **Respuestas de error en login:** Ante credenciales incorrectas o datos faltantes se devuelve un mensaje genérico ("Credenciales inválidas" o "Faltan datos") sin distinguir si el email existe.
- **Seed en producción:** La ruta `/api/admin/seed` responde 404 en producción; no se puede crear admin por esa vía en prod.
- **Rutas API:** Las respuestas JSON siguen el formato `{ ok: boolean, error?: string, ... }` y no se filtran stack traces ni detalles internos al cliente.

---

## 5. Limitaciones conocidas

- **Rate limit en memoria:** Tanto el de contacto como el de login usan un `Map` en memoria. En Vercel (serverless) cada instancia tiene su propio contador; el límite es por instancia, no global. Para un límite estricto por IP en múltiples instancias haría falta un almacén externo (p. ej. Redis).
- **Logout sin cookie:** Si alguien llama a `/api/admin/logout` sin cookie, la ruta igual responde 200 y no hace nada; no es un problema de seguridad.

---

*Última revisión: validación 2 — Seguridad Admin.*
