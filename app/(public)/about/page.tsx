import type { Metadata } from "next";
import AboutPage from "@/components/public/about/AboutPage";

export const metadata: Metadata = {
  title: "Sobre ViajeSeguro – Coche Compartido Barcelona Valencia",
  description:
    "Conoce la historia de ViajeSeguro, fundada en 2019. Coche compartido entre Barcelona y Valencia desde 20€.",
  keywords: [
    "sobre nosotros",
    "misión ViajeSeguro",
    "equipo ViajeSeguro",
    "coche compartido Barcelona Valencia",
  ],
  openGraph: {
    title: "Sobre ViajeSeguro – Coche Compartido Barcelona Valencia",
    description:
      "Conoce la historia de ViajeSeguro, fundada en 2019. Coche compartido entre Barcelona y Valencia desde 20€.",
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
    title: "Sobre ViajeSeguro – Coche Compartido Barcelona Valencia",
    description:
      "Conoce la historia de ViajeSeguro, fundada en 2019. Coche compartido entre Barcelona y Valencia desde 20€.",
    images: ["https://viajeseguro.site/main/plaza.jpeg"],
  },
  alternates: { canonical: "https://viajeseguro.site/about" },
};

const About = () => {
  return <AboutPage />;
};

export default About;
