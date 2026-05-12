import type { Metadata } from "next";
import PromotionsPage from "@/components/public/promotions/PromotionsPage";

export const metadata: Metadata = {
  title: "Descuentos en Coche Compartido | Club Lealtad y Fidelidad | ViajeSeguro",
  description:
    "Ahorra en cada viaje con el Club Lealtad (4,90€/mes) o el Club Fidelidad (49,90€/año). Viajes desde 15,40€ recomendando amigos. Únete gratis hoy.",
  keywords: [
    "promociones viaje compartido",
    "descuentos coche compartido",
    "Club Lealtad ViajeSeguro",
    "Club Fidelidad ViajeSeguro",
    "carpooling descuentos",
  ],
  openGraph: {
    title: "Descuentos en Coche Compartido | Club Lealtad y Fidelidad | ViajeSeguro",
    description:
      "Ahorra en cada viaje con el Club Lealtad (4,90€/mes) o el Club Fidelidad (49,90€/año). Viajes desde 15,40€ recomendando amigos.",
    url: "https://viajeseguro.site/promotions",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/plaza.jpeg",
        width: 1200,
        height: 630,
        alt: "Promociones y descuentos en ViajeSeguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Descuentos en Coche Compartido | Club Lealtad y Fidelidad | ViajeSeguro",
    description:
      "Ahorra en cada viaje con el Club Lealtad (4,90€/mes) o el Club Fidelidad (49,90€/año). Viajes desde 15,40€ recomendando amigos.",
    images: ["https://viajeseguro.site/main/plaza.jpeg"],
  },
  alternates: { canonical: "https://viajeseguro.site/promotions" },
};

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Club Lealtad ViajeSeguro",
  description: "Plan mensual de coche compartido con descuentos exclusivos",
  offers: {
    "@type": "Offer",
    price: "4.90",
    priceCurrency: "EUR",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "127",
  },
  review: [
    {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: "5" },
      author: { "@type": "Person", name: "Laura G." },
      reviewBody:
        "Con el Club Lealtad he ahorrado más de 50€ en un mes. Las cancelaciones flexibles me han salvado varias veces.",
    },
    {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: "5" },
      author: { "@type": "Person", name: "Carlos M." },
      reviewBody:
        "El Club Fidelidad es increíble. He recomendado a mis amigos y ahora mis viajes cuestan casi la mitad.",
    },
    {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: "4" },
      author: { "@type": "Person", name: "Ana P." },
      reviewBody:
        "Solo con registrarme ya empecé a ahorrar en cada viaje. La app es muy fácil de usar.",
    },
  ],
};

const Promotions = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <PromotionsPage />
    </>
  );
};

export default Promotions;
