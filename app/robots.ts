import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();

  if (process.env.NODE_ENV === "production") {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      // No incluir sitemap en modo bloqueo (sitio no indexable)
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
