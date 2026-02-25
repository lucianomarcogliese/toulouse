import { cookies } from "next/headers";
import { getSessionFromToken } from "./auth";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value ?? null;

  const session = await getSessionFromToken(token);

  if (!session) {
    return { ok: false as const, session: null };
  }

  return { ok: true as const, session };
}