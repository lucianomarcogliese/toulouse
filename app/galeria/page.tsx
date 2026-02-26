import GalleryClient from "@/components/GalleryClient";
import { getGalleryPhotos } from "@/lib/photos";
import type { Metadata } from "next";
import { unstable_noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Proyectos de interiorismo del estudio Toulouse Design. Residencial y comercial en zona norte y CABA. Fotos de trabajos realizados.",
  alternates: { canonical: "/galeria" },
  openGraph: {
    title: "Toulouse Design — Galería",
    description: "Proyectos de interiorismo del estudio Toulouse Design.",
  },
};

/** Siempre obtener fotos recientes de la DB (no cachear en build ni en request). */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GaleriaPage() {
  unstable_noStore();
  const photos = await getGalleryPhotos();
  return <GalleryClient photos={photos} />;
}