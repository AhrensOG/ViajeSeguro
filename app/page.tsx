import type { Metadata } from "next";
import HomePage from "@/components/public/home/HomePage";

export const metadata: Metadata = {
  title:
    "ViajeSeguro – Plataforma de coche compartido Madrid • Barcelona • Valencia",
  description:
    "Únete a ViajeSeguro, tu plataforma de viaje compartido (carpooling) entre Madrid, Barcelona y Valencia. Comparte gastos y viaja seguro.",
  keywords: [
    "coche compartido",
    "viaje compartido",
    "carpooling",
    "Madrid",
    "Barcelona",
    "Valencia",
    "ViajeSeguro",
  ],
  openGraph: {
    title: "ViajeSeguro – Plataforma de coche compartido en España",
    description:
      "Comparte tu viaje Madrid–Barcelona–Valencia, ahorra gastos y conoce gente nueva.",
    url: "https://viajeseguro.site/",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/nuestrahistoria.png",
        width: 1200,
        height: 630,
        alt: "Grupo de pasajeros disfrutando de un coche compartido ViajeSeguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViajeSeguro – Plataforma de coche compartido en España",
    description:
      "Comparte tu viaje Madrid–Barcelona–Valencia, ahorra gastos y conoce gente nueva.",
    images: ["https://viajeseguro.site/main/nuestrahistoria.png"],
  },
};

export default function Home() {
  return <HomePage />;
}
