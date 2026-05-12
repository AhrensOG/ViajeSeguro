import type { Metadata } from "next";
import FAQPage from "@/components/public/faq/FAQPage";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes sobre Coche Compartido | ViajeSeguro",
  description:
    "Resuelve tus dudas sobre cómo reservar, pagar o cancelar tu coche compartido con ViajeSeguro. Barcelona y Valencia desde 20€.",
  openGraph: {
    title: "Preguntas Frecuentes sobre Coche Compartido | ViajeSeguro",
    description:
      "Resuelve tus dudas sobre cómo reservar, pagar o cancelar tu coche compartido con ViajeSeguro.",
    url: "https://viajeseguro.site/faq",
  },
  twitter: {
    title: "Preguntas Frecuentes sobre Coche Compartido | ViajeSeguro",
    description:
      "Resuelve tus dudas sobre cómo reservar, pagar o cancelar tu coche compartido con ViajeSeguro.",
  },
  alternates: { canonical: "https://viajeseguro.site/faq" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo puedo reservar un viaje?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Busca tu ruta en la página principal, selecciona el viaje que más te convenga, elige tu asiento y completa el pago. Recibirás un email de confirmación con todos los detalles.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué métodos de pago aceptan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aceptamos tarjeta de crédito/débito (Stripe) y pago en efectivo al conductor. Todos los pagos online son 100% seguros.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo puedo cancelar mi reserva?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puedes cancelar desde tu panel de usuario hasta 24 horas antes del viaje. Consulta nuestra política de reembolso para más detalles.",
      },
    },
    {
      "@type": "Question",
      name: "¿Están asegurados los viajes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, todos los viajes realizados a través de ViajeSeguro cuentan con cobertura de seguro. Además, verificamos la identidad de todos los conductores.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo funciona el sistema de recomendaciones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comparte tu código de referido con amigos y ambos recibiréis descuentos en vuestros próximos viajes. Puedes encontrar tu código en tu perfil.",
      },
    },
  ],
};

const FAQ = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQPage />
    </>
  );
};

export default FAQ;
