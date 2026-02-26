import type { Metadata } from "next";
import { getGeoLandingData } from "@/lib/geoLandings";
import GeoLanding from "@/components/GeoLanding";

const SLUG = "diseno-interiores-zona-norte" as const;

export async function generateMetadata(): Promise<Metadata> {
  const data = getGeoLandingData(SLUG);
  const siteName = "Toulouse Design";
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title: `${siteName} — ${data.metaTitle}`,
      description: data.metaDescription,
    },
  };
}

export default function DisenoInterioresZonaNortePage() {
  const data = getGeoLandingData(SLUG);
  return (
    <main>
      <GeoLanding data={data} />
    </main>
  );
}
