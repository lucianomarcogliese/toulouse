# QA Checklist — Toulouse Estudio

Checklist manual para validar que el sitio y el panel admin están listos para producción. Ejecutar en entorno local y, cuando corresponda, en la URL de producción.

---

## 1. Páginas públicas

### Home (/)

- [ ] La página carga sin error.
- [ ] El hero muestra título y subtítulo (editables desde Admin · Textos si están configurados).
- [ ] La sección de servicios muestra 3 bloques con título y descripción.
- [ ] La sección "Proyectos destacados" muestra hasta 4 fotos marcadas como destacadas, o el mensaje de fallback si no hay ninguna.
- [ ] Los botones "Agendar consulta" y "Ver proyectos" enlazan a `/contacto` y `/galeria`.
- [ ] La imagen del hero se ve correctamente (estática o desde contenido).

### Galería (/galeria)

- [ ] La página carga sin error.
- [ ] Se listan las fotos en el orden configurado en el admin.
- [ ] Las imágenes cargan (rutas locales o Cloudinary según entorno).
- [ ] No hay errores 404 en imágenes ni en la consola del navegador.

### Sobre (/sobre)

- [ ] La página carga sin error.
- [ ] El contenido (título, párrafos) se muestra correctamente.
- [ ] Si hay bloques editables desde Admin · Textos, los cambios se reflejan al recargar.

### Servicios (/servicios)

- [ ] La página carga sin error.
- [ ] Los servicios y descripciones se muestran según el contenido editado en el admin.

### Contacto (/contacto)

- [ ] La página carga sin error.
- [ ] El formulario muestra campos: nombre, email, mensaje (y honeypot oculto).
- [ ] Al enviar con datos válidos:
  - [ ] Se muestra mensaje de éxito y el formulario se resetea.
  - [ ] En el admin (Mensajes) aparece el nuevo mensaje.
  - [ ] Se recibe el email por Resend (revisar bandeja o logs de Resend) si está configurado.
- [ ] **Validación:** Enviar sin nombre o sin email o sin mensaje → debe mostrarse error de validación.
- [ ] **Honeypot:** Si el campo "website" (oculto) se envía con valor, la API responde 200 pero no guarda mensaje ni envía email.
- [ ] **Rate limit:** Tras varios envíos seguidos desde la misma IP (p. ej. 5+ en 10 min), la API debe responder 429 y mensaje "Demasiados intentos...".
- [ ] **Respuesta JSON:** En error, la API devuelve `{ ok: false, error: "..." }`; en éxito `{ ok: true }` (o con `id`).

---

## 2. Admin

### Login (/admin/login)

- [ ] Sin sesión, al entrar a `/admin/fotos`, `/admin/textos` o `/admin/mensajes` se redirige a `/admin/login`.
- [ ] Con email/password incorrectos → mensaje de error (ej. "Credenciales inválidas") y respuesta 401 con `{ ok: false, error: "..." }`.
- [ ] Con credenciales correctas → redirección a `/admin/fotos` (o a la ruta que corresponda) y cookie de sesión establecida.
- [ ] La cookie `admin_session` es `httpOnly` y en producción `secure`.

### Logout

- [ ] Desde cualquier página del admin, el botón "Salir" (o equivalente) cierra la sesión.
- [ ] Tras salir, al intentar acceder de nuevo a `/admin/fotos` (o textos/mensajes) se redirige a login.
- [ ] La API `/api/admin/logout` (POST) devuelve `{ ok: true }`.

### Admin · Fotos (/admin/fotos)

- [ ] Listado de fotos carga correctamente (orden por `sortOrder` y fecha).
- [ ] **Crear:** Subir imagen + título + categoría + opcional "destacada" → la foto aparece en la lista y en la galería pública.
- [ ] **Editar:** Cambiar título, categoría o destacada y guardar → los cambios se reflejan en la lista y en la galería.
- [ ] **Reordenar:** Usar "Subir" / "Bajar" (o controles de orden) → el orden cambia en la lista y en `/galeria`.
- [ ] **Eliminar:** Borrar una foto → desaparece de la lista y de la galería; si estaba en Cloudinary, se elimina también (con `CLOUDINARY_API_SECRET` configurado).
- [ ] Filtro por categoría (si existe) filtra correctamente.
- [ ] Sin sesión válida, las peticiones a `/api/admin/photos` y `/api/admin/upload` devuelven 401 con `{ ok: false, error: "..." }`.

### Admin · Textos (/admin/textos)

- [ ] Se cargan los bloques de contenido definidos en `CONTENT_KEY_SPECS`.
- [ ] Editar un bloque y guardar → el cambio se persiste y se ve en la página pública correspondiente (Home, Sobre, Servicios, etc.) al recargar.
- [ ] Mensaje de confirmación ("Guardado ✅" o similar) tras guardar.
- [ ] Sin sesión, la API `/api/admin/content` devuelve 401.

### Admin · Mensajes (/admin/mensajes)

- [ ] Listado de mensajes de contacto carga (paginado si aplica).
- [ ] Cada mensaje muestra nombre, email, mensaje y estado (nuevo/leído).
- [ ] Marcar como leído / nuevo (si hay PATCH) actualiza el estado.
- [ ] Sin sesión, la API devuelve 401.

---

## 3. Formulario de contacto (detalle)

- [ ] **Envío correcto:** Body JSON con `nombre`, `email`, `mensaje`; opcional `website` (honeypot). Respuesta 200 y `{ ok: true }`.
- [ ] **Validación:** Faltan datos o email inválido → 400 y `{ ok: false, error: "..." }`.
- [ ] **Rate limit:** Tras superar el límite por IP → 429 y `{ ok: false, error: "Demasiados intentos..." }`.
- [ ] **Honeypot:** Si `website` tiene valor → 200 y `{ ok: true }` pero no se crea mensaje en DB ni se envía email.
- [ ] **Guardado en DB:** Con envío válido y sin honeypot, existe un registro en la tabla de mensajes de contacto (y en el panel Admin · Mensajes).
- [ ] **Email:** Con Resend configurado, se envía el correo al destinatario configurado en la ruta `/api/contact`.

---

## 4. Rutas API (resumen de consistencia)

Todas las respuestas JSON deben seguir:

- **Éxito:** `{ ok: true, ... }` (con datos adicionales si aplica).
- **Error:** `{ ok: false, error: "mensaje" }` (y status HTTP adecuado: 400, 401, 404, 429, 500).

No se exponen stack traces ni mensajes internos al cliente en producción.

Rutas revisadas:

- `/api/contact` — POST: validación, rate limit, honeypot, guardado DB, email.
- `/api/admin/login` — POST: credenciales, cookie, redirect o JSON.
- `/api/admin/logout` — POST: invalida sesión y cookie.
- `/api/admin/photos` — GET/POST: listado y creación.
- `/api/admin/photos/[id]` — PATCH/DELETE: actualizar y borrar (incl. Cloudinary si aplica).
- `/api/admin/photos/[id]/featured` — PATCH: destacada.
- `/api/admin/photos/[id]/reorder` — PATCH: orden.
- `/api/admin/upload` — POST: subida a Cloudinary o a `/public/uploads`.
- `/api/admin/content` — GET/POST: bloques de texto.
- `/api/admin/messages` — GET: listado de mensajes.
- `/api/admin/messages/[id]` — GET/PATCH: detalle y estado.
- `/api/admin/seed` — POST: solo en desarrollo; en producción responde 404.

---

## 5. Verificaciones previas al deploy

- [ ] `npm run lint` pasa sin errores.
- [ ] `npm run build` termina correctamente.
- [ ] `npm run start` (o simulación de producción local) sirve el sitio y las rutas anteriores sin errores.
- [ ] En el código cliente no se usa `process.env` para secretos; las variables sensibles están solo en servidor (`lib/env.ts` o rutas API).
- [ ] Variables de entorno de producción (Vercel) configuradas según `README_DEPLOY.md` (incl. `CLOUDINARY_UPLOAD_PRESET` para uploads en prod).

---

*Última actualización: validación post-auditoría QA.*
