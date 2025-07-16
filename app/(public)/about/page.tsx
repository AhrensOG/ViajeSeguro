import type { Metadata } from "next";
import AboutPage from "@/components/public/about/AboutPage";
import React from "react";

export const metadata: Metadata = {
  title: "Sobre Nosotros | ViajeSeguro – Plataforma de coche compartido",
  description:
    "Conoce la misión, valores y equipo de ViajeSeguro. Más de 5.000 usuarios confían en nuestro viaje compartido entre Madrid, Barcelona y Valencia.",
  keywords: [
    "sobre nosotros",
    "misión ViajeSeguro",
    "equipo ViajeSeguro",
    "coche compartido",
  ],
  openGraph: {
    title: "Sobre Nosotros | ViajeSeguro – Coche compartido en España",
    description:
      "Descubre nuestra misión, valores y equipo que hacen posible el carpooling seguro en ViajeSeguro.",
    url: "https://viajeseguro.site/about",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/plaza.jpeg",
        width: 1200,
        height: 630,
        alt: "Equipo de ViajeSeguro junto a coche compartido",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Nosotros | ViajeSeguro – Coche compartido en España",
    description:
      "Descubre nuestra misión, valores y equipo que hacen posible el carpooling seguro en ViajeSeguro.",
    images: ["https://viajeseguro.site/main/plaza.jpeg"],
  },
};

const About = () => {
  return <AboutPage />;
};

export default About;
