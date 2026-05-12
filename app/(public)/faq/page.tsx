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
      name: "¿Cómo puedo reservar un viaje en coche compartido Barcelona Valencia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Busca tu ruta en la página principal seleccionando origen y destino, elige el viaje que más te convenga, selecciona tu asiento y completa el pago online. Recibirás un email de confirmación con todos los detalles del trayecto.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué métodos de pago aceptan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aceptamos tarjeta de crédito y débito (Visa, Mastercard, American Express), PayPal, y en algunos trayectos también ofrecemos la opción de pago en efectivo al conductor. Todos los pagos online son 100% seguros.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta el coche compartido de Barcelona a Valencia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El precio del coche compartido entre Barcelona y Valencia con ViajeSeguro empieza desde 20€ por plaza para la modalidad compartida. Ofrecemos también opciones semiexclusivas y exclusivas. El seguro está incluido en todos los precios.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto dura el viaje de Barcelona a Valencia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El trayecto de Barcelona a Valencia dura aproximadamente 3 horas y media, recorriendo unos 350 km por la AP-7. Es un viaje directo sin paradas intermedias, mucho más rápido que el autobús convencional.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo puedo cancelar mi reserva?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puedes cancelar desde tu panel de usuario hasta 24 horas antes del viaje con reembolso del 100%. Si cancelas con menos antelación, el reembolso depende de tu plan de suscripción. Consulta nuestra política de cancelación para más detalles.",
      },
    },
    {
      "@type": "Question",
      name: "¿Están asegurados los viajes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, todos los viajes realizados a través de ViajeSeguro cuentan con cobertura de seguro básico que complementa el seguro obligatorio del vehículo. Además, verificamos la identidad de todos los conductores y sus vehículos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Dónde me recogen en Barcelona o Valencia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ofrecemos recogida en puntos clave: en Barcelona (Sants Estació, Plaça Catalunya, Aeropuerto BCN) y en Valencia (Estación del Norte, Plaza de la Reina, Aeropuerto VLC). Durante la reserva puedes elegir el punto más conveniente.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo modificar mi reserva después de confirmarla?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No es posible modificar directamente una reserva ya confirmada. Si necesitas cambiar la fecha, hora o número de plazas, deberás cancelar la reserva actual (sujeto a política de cancelación) y crear una nueva.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo funciona el sistema de recomendaciones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comparte tu código de referido con amigos que aún no usen ViajeSeguro. Cuando se registren y completen su primer viaje, ambos recibiréis descuentos. Puedes encontrar tu código en la sección 'Recomienda y ahorra' de tu cuenta.",
      },
    },
    {
      "@type": "Question",
      name: "¿El coche compartido es más barato que el AVE o autobús?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, el coche compartido Barcelona-Valencia desde 20€ es más barato que el AVE (35-60€) y competitivo frente al autobús (25-35€), con la ventaja adicional de un vehículo privado, sin paradas intermedias y con cancelación gratuita hasta 24h antes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si el conductor cancela el viaje?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si el conductor cancela el viaje, recibirás una notificación inmediata y se te reembolsará el 100% del importe pagado, independientemente del plan que tengas. Además, te ofreceremos alternativas de viaje disponibles.",
      },
    },
    {
      "@type": "Question",
      name: "¿Los conductores de ViajeSeguro están verificados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, todos los conductores pasan por un proceso de verificación que incluye validación de identidad, licencia de conducir vigente, documentación del vehículo y seguro. El sistema de valoraciones garantiza la calidad y confianza en la comunidad.",
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
