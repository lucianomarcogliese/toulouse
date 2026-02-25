/**
 * Rate limit simple por IP para /api/contact.
 * Dev: Map en memoria. Prod: usar x-forwarded-for si existe.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX_REQUESTS = 5;

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

function prune() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const via = req.headers.get("x-real-ip");
  if (via) return via;
  return "unknown";
}

/**
 * Devuelve true si el request está permitido, false si excedió el límite.
 * Llamar antes de procesar; si devuelve false, responder 429.
 */
export function checkContactRateLimit(ip: string): boolean {
  prune();
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) return false;
  entry.count += 1;
  return true;
}

// --- Rate limit para /api/admin/login (brute force) ---

const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 min
const LOGIN_MAX_ATTEMPTS = 10;

const loginStore = new Map<string, Entry>();

function pruneLogin() {
  const now = Date.now();
  for (const [key, entry] of loginStore.entries()) {
    if (entry.resetAt <= now) loginStore.delete(key);
  }
}

/**
 * Devuelve true si el intento de login está permitido, false si se excedió el límite por IP.
 * Cuenta cada intento (éxito o fallo). Llamar al inicio del POST de login.
 */
export function checkLoginRateLimit(ip: string): boolean {
  pruneLogin();
  const now = Date.now();
  const entry = loginStore.get(ip);

  if (!entry) {
    loginStore.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }

  if (entry.resetAt <= now) {
    loginStore.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }

  if (entry.count >= LOGIN_MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}
