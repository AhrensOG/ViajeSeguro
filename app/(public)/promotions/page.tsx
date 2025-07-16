import type { Metadata } from "next";
import PromotionsPage from "@/components/public/promotions/PromotionsPage";
import React from "react";

export const metadata: Metadata = {
  title: "Promociones viaje compartido 8 plazas | ViajeSeguro",
  description:
    "Ahorra con ViajeSeguro: Cliente Preferencial GRATIS, Club Lealtad 4,90 €/mes o Club Fidelidad 49,90 €/año. Cancelaciones flexibles y extras exclusivos.",
  keywords: [
    "promociones viaje compartido",
    "descuentos 8 plazas",
    "carpooling",
    "ViajeSeguro",
  ],
  openGraph: {
    title: "Promociones viaje compartido 8 plazas | ViajeSeguro",
    description:
      "Elige Cliente Preferencial GRATIS, Club Lealtad 4,90 €/mes o Club Fidelidad 49,90 €/año y comparte viaje con ventajas.",
    url: "https://viajeseguro.site/promotions",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/plaza.jpeg",
        width: 1200,
        height: 630,
        alt: "Promociones viaje compartido en ViajeSeguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Promociones viaje compartido 8 plazas | ViajeSeguro",
    description:
      "Elige Cliente Preferencial GRATIS, Club Lealtad 4,90 €/mes o Club Fidelidad 49,90 €/año y comparte viaje con ventajas.",
    images: ["https://viajeseguro.site/main/plaza.jpeg"],
  },
};

const Promotions = () => {
  return <PromotionsPage />;
};

export default Promotions;
