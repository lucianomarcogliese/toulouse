import GalleryClient from "@/components/GalleryClient";
import { getGalleryPhotos } from "@/lib/photos";
import type { Metadata } from "next";
import { unstable_noStore } from "next/cache";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Proyectos de diseño de interiores del estudio Toulouse. Residencial, comercial y dirección de obra.",
  alternates: { canonical: "/galeria" },
  openGraph: {
    title: "Galería | TOULOUSE — Diseño de interiores",
    description: "Proyectos de diseño de interiores del estudio Toulouse.",
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