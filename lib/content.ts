import { prisma } from "./prisma";

/** Keys disponibles en lib/contentKeys.ts */

/** Trae todos los ContentBlock y devuelve Record<key, value>. */
export async function getContentMap(): Promise<Record<string, string>> {
  const blocks = await prisma.contentBlock.findMany();
  const map: Record<string, string> = {};
  for (const b of blocks) map[b.key] = b.value;
  return map;
}

/** Devuelve map[key] si existe y no está vacío, sino fallback. */
export function pick(map: Record<string, string>, key: string, fallback: string): string {
  const v = map[key];
  return (v ?? "").trim() ? v : fallback;
}