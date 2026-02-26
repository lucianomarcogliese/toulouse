import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site";
import { isPrivateMode } from "@/lib/siteMode";

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();

  if (isPrivateMode) {
    return {
      rules: { userAgent: "*", disallow: "/" },
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
