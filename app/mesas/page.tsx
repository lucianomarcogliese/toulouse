import type { Metadata } from "next";
import { getContentMap, pick } from "@/lib/content";
import { getCategoryBySlug } from "@/lib/categoryLandings";
import CategoryJsonLd from "@/components/CategoryJsonLd";
import CategoryLanding from "@/components/CategoryLanding";

const SLUG = "mesas" as const;

export async function generateMetadata(): Promise<Metadata> {
  const category = getCategoryBySlug(SLUG);
  const siteName = "Toulouse Design";
  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title: `${siteName} — ${category.metaTitle}`,
      description: category.metaDescription,
    },
  };
}

export default async function MesasPage() {
  const category = getCategoryBySlug(SLUG);
  const content = await getContentMap();
  const whatsapp = pick(content, "contact.whatsapp", "5491112345678");
  const whatsappMessage = pick(
    content,
    "contact.whatsappMessage",
    "Hola Toulouse, quiero consultar por un proyecto de interiorismo."
  );
  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main>
      <CategoryJsonLd category={category} />
      <CategoryLanding category={category} whatsappHref={whatsappHref} />
    </main>
  );
}
