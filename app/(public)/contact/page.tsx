import type { Metadata } from "next";
import ContactPage from "@/components/public/contact/ContactPage";
import React from "react";

export const metadata: Metadata = {
  title: "Contacto | ViajeSeguro – Soporte viaje compartido 24/7",
  description:
    "¿Tienes dudas o necesitas ayuda? Contacta con ViajeSeguro y recibe soporte 24/7 para tu experiencia de viaje compartido en España.",
  keywords: [
    "contacto ViajeSeguro",
    "soporte viaje compartido",
    "ayuda carpooling",
  ],
  openGraph: {
    title: "Contacto | ViajeSeguro – Soporte viaje compartido",
    description:
      "Escríbenos para consultas, sugerencias o ayuda con tu carpooling. Estamos disponibles 24/7.",
    url: "https://viajeseguro.site/contact",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/plaza.jpeg",
        width: 1200,
        height: 630,
        alt: "Mapa de ubicación de oficina de ViajeSeguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | ViajeSeguro – Soporte viaje compartido",
    description:
      "Escríbenos para consultas, sugerencias o ayuda con tu carpooling. Estamos disponibles 24/7.",
    images: ["https://viajeseguro.site/main/plaza.jpeg"],
  },
};

const Contact = () => {
  return <ContactPage />;
};

export default Contact;
