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
  metadataBase: new URL("https://viajeseguro.site"),
  title: {
    default: "Coche Compartido Barcelona Valencia desde 20€ | ViajeSeguro",
    template: "%s | ViajeSeguro",
  },
  description:
    "Reserva tu plaza de coche compartido entre Barcelona y Valencia desde 20€. Viaje directo en 3.5h, conductor profesional, sin cancelaciones hasta 24h antes.",
  keywords: [
    "coche compartido Barcelona Valencia",
    "viaje compartido Barcelona",
    "carpooling Barcelona Valencia",
    "ViajeSeguro",
    "compartir coche Barcelona",
    "viajes económicos Barcelona Valencia",
    "transporte Barcelona Valencia",
  ],
  openGraph: {
    title: "Coche Compartido Barcelona Valencia desde 20€ | ViajeSeguro",
    description:
      "Reserva tu plaza de coche compartido entre Barcelona y Valencia desde 20€. Viaje directo en 3.5h, conductor profesional, sin cancelaciones hasta 24h antes.",
    url: "https://viajeseguro.site",
    siteName: "ViajeSeguro",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/plaza.jpeg",
        width: 1200,
        height: 630,
        alt: "Coche compartido Barcelona Valencia - ViajeSeguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coche Compartido Barcelona Valencia desde 20€ | ViajeSeguro",
    description:
      "Reserva tu plaza de coche compartido entre Barcelona y Valencia desde 20€. Viaje directo en 3.5h, conductor profesional, sin cancelaciones hasta 24h antes.",
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
