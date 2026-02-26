# Modo privado (Basic Auth global)

Protege **todo el sitio** con usuario y contraseña (HTTP Basic Auth) antes de mostrar cualquier página. Útil para ocultar el sitio en producción hasta el lanzamiento o para entornos de previsualización.

## Qué hace

- Al entrar a **cualquier ruta de página** (/, /galeria, /contacto, /admin, etc.), el navegador muestra el cuadro de diálogo de usuario/contraseña.
- Solo se puede acceder al contenido si se envían las credenciales correctas en el header `Authorization: Basic ...`.
- **No afecta** al login del admin: primero se supera Basic Auth (usuario/contraseña del sitio) y luego, en rutas `/admin/*`, sigue aplicando la lógica de cookie de sesión del panel.

## Rutas que no requieren Basic Auth

- **Assets:** `/_next/*`, `/favicon.ico`, `/uploads/*`, `/proyectos/*`
- **SEO:** `/robots.txt`, `/sitemap.xml`
- **APIs:** `/api/*` (por defecto no se bloquean para que el formulario de contacto y el admin sigan funcionando)

## Cómo activarlo en Vercel

1. En el proyecto de Vercel → **Settings** → **Environment Variables**.
2. Agregá dos variables (por ejemplo solo para **Production**):
   - **`SITE_USER`** → usuario que querés usar (ej. `toulouse`)
   - **`SITE_PASS`** → contraseña (ej. una clave fuerte)
3. **Redeploy** el proyecto para que el middleware use las nuevas variables.

A partir de ese momento, en producción el sitio pedirá usuario y contraseña al cargar cualquier página.

## Cómo desactivarlo

**Opción A (recomendada):** Borrá las variables **`SITE_USER`** y **`SITE_PASS`** en Vercel (Environment Variables) y hacé un **Redeploy**. Si no están definidas, el middleware no aplica Basic Auth y el sitio queda abierto.

**Opción B:** En el código, comentá o eliminá el bloque de Basic Auth en `middleware.ts` (el `if (!validateBasicAuth(...))` y el `return new NextResponse(...)`), o ajustá el `matcher` para que el middleware no se ejecute en las rutas que quieras dejar públicas.

## Variables de entorno

| Variable    | Requerida | Descripción                          |
|------------|-----------|--------------------------------------|
| `SITE_USER` | No        | Usuario para Basic Auth. Si no existe, no se activa el modo privado. |
| `SITE_PASS` | No        | Contraseña para Basic Auth. Debe existir junto con `SITE_USER`.       |

**Ejemplo en `.env.local` (solo para probar en local):**

```env
SITE_USER=toulouse
SITE_PASS=mi-clave-secreta
```

En local, si **no** definís estas variables, el sitio no pide Basic Auth (ideal para desarrollo).

## Bloquear también las APIs

Por defecto las rutas `/api/*` están **excluidas** del Basic Auth para que el formulario de contacto y el login del admin sigan funcionando. Si querés que las APIs también exijan Basic Auth, en `middleware.ts` comentá la línea que permite `/api/` en `isAllowedWithoutAuth` y descomentá la que las bloquea (ahí hay un comentario en el código).

## Resumen

- **Activar:** Definir `SITE_USER` y `SITE_PASS` en Vercel y redeploy.
- **Desactivar:** Borrar esas variables en Vercel y redeploy.
- **Local:** Sin variables, el sitio no pide Basic Auth.
