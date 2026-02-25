/**
 * Foto para admin (lista, edición, reorden).
 * Coincide con el modelo Prisma + serialización (createdAt como string en JSON).
 */
export type Photo = {
  id: string;
  title: string;
  category: string;
  src: string;
  cloudinaryId?: string | null;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
};

/**
 * Foto para galería pública (servidor puede enviar Date, cliente recibe string).
 */
export type GalleryPhoto = {
  id: string;
  title: string;
  category: string;
  src: string;
  featured?: boolean;
  sortOrder?: number;
  createdAt?: string | Date;
};
