import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/public/Providers";
import { Toaster } from "sonner";
import CookiesModal from "@/components/public/cookies/CookiesModal";
import GlobalRestrictionWarning from "@/components/common/GlobalRestrictionWarning";
import GlobalBanGuard from "@/components/common/GlobalBanGuard";
import JsonLd from "@/components/common/JsonLd";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "ViajeSeguro - Viaje compartido entre ciudades",
    template: "%s | ViajeSeguro",
  },
  description:
    "Viaja entre Madrid, Barcelona y Valencia desde 27€. Comparte viaje y ahorra con ViajeSeguro, la plataforma de carpooling segura en España.",
  keywords: [
    "viaje compartido",
    "carpooling",
    "Madrid",
    "Barcelona",
    "Valencia",
    "ViajeSeguro",
    "compartir coche",
    "viajes económicos",
  ],
  openGraph: {
    title: "ViajeSeguro - Viaje compartido entre ciudades",
    description:
      "Viaja entre Madrid, Barcelona y Valencia desde 27€. Comparte viaje y ahorra.",
    url: "https://viajeseguro.site",
    siteName: "ViajeSeguro",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/plaza.jpeg",
        width: 1200,
        height: 630,
        alt: "ViajeSeguro - Viaje compartido",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViajeSeguro - Viaje compartido entre ciudades",
    description:
      "Viaja entre Madrid, Barcelona y Valencia desde 27€. Comparte viaje y ahorra.",
    images: ["https://viajeseguro.site/main/plaza.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://viajeseguro.site",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} antialiased`}>
        <JsonLd />
        <Toaster position="bottom-right" richColors />
        <Providers>
          <GlobalBanGuard />
          <GlobalRestrictionWarning />
          {children}
        </Providers>
        <CookiesModal />
      </body>
    </html>
  );
}
