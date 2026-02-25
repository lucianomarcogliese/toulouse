/**
 * Bloque de contenido CMS (key/value).
 * Coincide con Prisma ContentBlock.
 */
export type ContentBlock = {
  key: string;
  value: string;
  updatedAt?: string | Date;
};
