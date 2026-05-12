import type { Metadata } from "next";
import ServicesPage from "@/components/public/services/ServicesPage";

export const metadata: Metadata = {
  title: "Viaje Compartido Barcelona Valencia | ViajeSeguro",
  description:
    "Elige entre coche compartido desde 20€, semiexclusivo o exclusivo. Recogida en tu zona en Barcelona y Valencia. Reserva online.",
  keywords: [
    "viaje compartido Barcelona",
    "coche compartido Valencia",
    "servicios viaje compartido",
    "carpooling",
  ],
  openGraph: {
    title: "Viaje Compartido Barcelona Valencia | ViajeSeguro",
    description:
      "Elige entre coche compartido desde 20€, semiexclusivo o exclusivo. Recogida en tu zona en Barcelona y Valencia.",
    url: "https://viajeseguro.site/services",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/plaza.jpeg",
        width: 1200,
        height: 630,
        alt: "Servicios de viaje compartido en ViajeSeguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viaje Compartido Barcelona Valencia | ViajeSeguro",
    description:
      "Elige entre coche compartido desde 20€, semiexclusivo o exclusivo. Recogida en tu zona en Barcelona y Valencia.",
    images: ["https://viajeseguro.site/main/plaza.jpeg"],
  },
  alternates: { canonical: "https://viajeseguro.site/services" },
};

const Services = () => {
  return <ServicesPage />;
};

export default Services;
