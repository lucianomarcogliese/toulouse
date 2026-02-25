import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { getGalleryPhotos } from "@/lib/photos";

export const runtime = "nodejs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/galeria`,
      lastModified: await getLastModifiedGaleria(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/servicios`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  return staticRoutes;
}

async function getLastModifiedGaleria(): Promise<Date> {
  try {
    const photos = await getGalleryPhotos();
    const latest = photos[0];
    return latest?.createdAt ?? new Date();
  } catch {
    return new Date();
  }
}
