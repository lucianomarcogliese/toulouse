import type { CategoryLandingData } from "@/lib/categoryLandings";
import { getServiceJsonLd } from "@/lib/categoryLandings";

export default function CategoryJsonLd({ category }: { category: CategoryLandingData }) {
  const jsonLd = getServiceJsonLd(category);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
