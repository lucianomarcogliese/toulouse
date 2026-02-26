import { getBaseUrl } from "@/lib/site";

const SITE_NAME = "Toulouse Design";
const AREA_SERVED = "Zona Norte, Buenos Aires";
const EMAIL = "hola@toulouse.com";
const WHATSAPP_NUMBER = "5491112345678";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
/** Reemplazar por la URL real cuando exista. */
const INSTAGRAM_URL = "https://instagram.com/toulousedesign";

export default function SeoSchema() {
  const baseUrl = getBaseUrl();

  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: SITE_NAME,
    url: baseUrl,
    sameAs: [INSTAGRAM_URL, WHATSAPP_URL],
    areaServed: AREA_SERVED,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: EMAIL,
      url: WHATSAPP_URL,
      availableLanguage: "Spanish",
      areaServed: "AR",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: baseUrl,
    publisher: { "@id": `${baseUrl}#organization` },
    inLanguage: "es-AR",
  };

  const organizationWithId = { ...organization, "@id": `${baseUrl}#organization` };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationWithId),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(website),
        }}
      />
    </>
  );
}
