import type { Metadata } from "next";
import ServicesPage from "@/components/public/services/ServicesPage";
import React from "react";

export const metadata: Metadata = {
  title: "Servicios de viaje compartido | ViajeSeguro – Publica y reserva",
  description:
    "Publica tu viaje, reserva plaza y valora a conductores en ViajeSeguro. Asistencia 24/7 y sistema de confianza para tu carpooling.",
  keywords: [
    "servicios viaje compartido",
    "publicar viaje",
    "reservar plaza",
    "valoraciones",
    "asistencia 24/7",
  ],
  openGraph: {
    title: "Servicios de viaje compartido | ViajeSeguro",
    description:
      "Publica tu ruta, reserva plazas y disfruta de asistencia 24/7. El carpooling nunca fue tan fácil.",
    url: "https://viajeseguro.site/services",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/plaza.jpeg",
        width: 1200,
        height: 630,
        alt: "Formulario para publicar viaje compartido en ViajeSeguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Servicios de viaje compartido | ViajeSeguro",
    description:
      "Publica tu ruta, reserva plazas y disfruta de asistencia 24/7. El carpooling nunca fue tan fácil.",
    images: ["https://viajeseguro.site/main/plaza.jpeg",],
  },
};

const Services = () => {
  return <ServicesPage />;
};

export default Services;
