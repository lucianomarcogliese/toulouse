import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoSchema from "@/components/SeoSchema";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import InstagramFloat from "@/components/InstagramFloat";
import Container from "@/components/Container";
import { Analytics } from "@vercel/analytics/react";
import { getBaseUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Toulouse Design";
const defaultTitle = "Toulouse Design — Estudio de interiorismo boutique";
const defaultDescription =
  "Estudio de interiorismo boutique. Proyectos residenciales y comerciales en zona norte y CABA. Concepto, materiales y dirección de obra con estética atemporal.";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: defaultTitle,
    template: `${siteName} — %s`,
  },
  description: defaultDescription,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Toulouse Design — Estudio de interiorismo boutique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-[var(--background)] antialiased`}
      >
        <SeoSchema />
        <Navbar />
        <main className="flex-1 pb-24 md:pb-28">
          <Container>{children}</Container>
        </main>
        <Footer />
        <InstagramFloat />
        <WhatsAppFloat />
        {process.env.NODE_ENV === "production" ? <Analytics /> : null}
      </body>
    </html>
  );
}
