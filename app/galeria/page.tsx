import GalleryClient from "@/components/GalleryClient";
import { getGalleryPhotos } from "@/lib/photos";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Proyectos de diseño de interiores del estudio Toulouse. Residencial, comercial y dirección de obra.",
  openGraph: {
    title: "Galería | TOULOUSE — Diseño de interiores",
    description: "Proyectos de diseño de interiores del estudio Toulouse.",
  },
};

export default async function GaleriaPage() {
  const photos = await getGalleryPhotos();
  return <GalleryClient photos={photos} />;
}