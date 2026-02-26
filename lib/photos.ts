import { prisma } from "./prisma";
import { getPhotoAlt } from "./photoAlt";

export { getPhotoAlt };

const photoOrderBy = [{ sortOrder: "asc" as const }, { createdAt: "desc" as const }];

export async function getGalleryPhotos() {
  return prisma.photo.findMany({
    orderBy: photoOrderBy,
  });
}

/** Fotos destacadas ordenadas por order y fecha. */
export async function getFeaturedPhotos(limit?: number) {
  return prisma.photo.findMany({
    where: { featured: true },
    orderBy: photoOrderBy,
    ...(limit != null && { take: limit }),
  });
}