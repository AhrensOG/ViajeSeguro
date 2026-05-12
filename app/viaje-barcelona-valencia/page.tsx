import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, MapPin, Euro, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Coche Compartido Barcelona a Valencia desde 20€ | ViajeSeguro",
  description:
    "Viaja de Barcelona a Valencia en coche compartido desde 20€. Salidas diarias, recogida en tu zona, 3.5h de trayecto directo, conductor profesional y seguro incluido. Reserva online.",
  openGraph: {
    title: "Coche Compartido Barcelona a Valencia desde 20€ | ViajeSeguro",
    description:
      "Viaja de Barcelona a Valencia en coche compartido desde 20€. Salidas diarias, 3.5h de trayecto, conductor profesional.",
    url: "https://viajeseguro.site/viaje-barcelona-valencia",
    images: [{ url: "https://viajeseguro.site/main/plaza.jpeg", width: 1200, height: 630, alt: "Coche compartido Barcelona a Valencia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coche Compartido Barcelona a Valencia desde 20€ | ViajeSeguro",
    description:
      "Viaja de Barcelona a Valencia en coche compartido desde 20€. Salidas diarias, 3.5h de trayecto, conductor profesional.",
    images: ["https://viajeseguro.site/main/plaza.jpeg"],
  },
  alternates: { canonical: "https://viajeseguro.site/viaje-barcelona-valencia" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Coche compartido Barcelona a Valencia",
  description: "Servicio de coche compartido de Barcelona a Valencia. Viaje directo de 3.5h, desde 20€ por plaza, con conductor profesional y seguro incluido.",
  provider: {
    "@type": "Organization",
    name: "ViajeSeguro",
    url: "https://viajeseguro.site",
  },
  areaServed: [
    { "@type": "City", name: "Barcelona" },
    { "@type": "City", name: "Valencia" },
  ],
  offers: {
    "@type": "Offer",
    price: "20",
    priceCurrency: "EUR",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    url: "https://viajeseguro.site/viaje-barcelona-valencia",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto cuesta el coche compartido de Barcelona a Valencia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El precio del coche compartido de Barcelona a Valencia con ViajeSeguro empieza desde 20€ por plaza. El precio puede variar según la modalidad elegida: compartido, semiexclusivo o exclusivo. No hay cargos ocultos, el seguro está incluido.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tarda el viaje de Barcelona a Valencia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El trayecto de Barcelona a Valencia tiene una duración aproximada de 3 horas y 30 minutos, recorriendo unos 350 km por la AP-7. El tiempo puede variar ligeramente según las condiciones de tráfico y el punto de recogida exacto.",
      },
    },
    {
      "@type": "Question",
      name: "¿Dónde me recogen en Barcelona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ofrecemos recogida en diferentes puntos de Barcelona: Sants Estació, Plaça Catalunya, Aeropuerto de Barcelona (BCN), Zona Universitària y otros puntos acordados con el conductor. Durante la reserva podrás seleccionar el punto más conveniente para ti.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo cancelar mi viaje de Barcelona a Valencia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, ViajeSeguro ofrece cancelación gratuita hasta 24 horas antes de la salida con reembolso del 100%. Si cancelas con menos de 24 horas de antelación, el reembolso dependerá de tu plan de suscripción.",
      },
    },
    {
      "@type": "Question",
      name: "¿Es más barato que el tren o el autobús?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, el coche compartido con ViajeSeguro desde 20€ es significativamente más barato que el AVE (que suele costar entre 35€ y 60€) y competitivo frente al autobús (desde 25€), pero con la ventaja de un vehículo privado, sin paradas intermedias y con horarios flexibles.",
      },
    },
    {
      "@type": "Question",
      name: "¿Los conductores están verificados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, todos los conductores de ViajeSeguro pasan por un proceso de verificación que incluye validación de identidad, licencia de conducir vigente, documentación del vehículo y seguro. Además, contamos con un sistema de valoraciones que garantiza la calidad del servicio.",
      },
    },
  ],
};

const ViajeBarcelonaValencia = () => {
  const searchParams = new URLSearchParams({
    origin: "Barcelona",
    destination: "Valencia", serviceType: "SIMPLE_TRIP", mode: "car",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-600 transition">Inicio</Link>
            <ChevronRight className="inline w-3 h-3 mx-1" />
            <span className="text-gray-800 font-medium">Barcelona a Valencia</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Coche compartido Barcelona a Valencia
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            Viaja de Barcelona a Valencia en coche compartido desde solo <strong>20€</strong> con ViajeSeguro. 
            Un trayecto directo de aproximadamente <strong>350 km</strong> por la AP-7 con una duración de <strong>3 horas y media</strong>. 
            Olvídate del estrés de conducir, de los horarios rígidos del tren o de las infinitas paradas del autobús. 
            Reserva tu plaza online, elige tu punto de recogida en Barcelona y disfruta de un viaje cómodo, 
            seguro y económico hasta Valencia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <MapPin className="w-6 h-6 text-amber-500 mb-3" />
              <h2 className="font-semibold text-gray-900 mb-1">Distancia</h2>
              <p className="text-2xl font-bold text-gray-800">350 km</p>
              <p className="text-sm text-gray-500">AP-7 / Autopista</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <Clock className="w-6 h-6 text-amber-500 mb-3" />
              <h2 className="font-semibold text-gray-900 mb-1">Duración</h2>
              <p className="text-2xl font-bold text-gray-800">3h 30min</p>
              <p className="text-sm text-gray-500">Tiempo estimado</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <Euro className="w-6 h-6 text-amber-500 mb-3" />
              <h2 className="font-semibold text-gray-900 mb-1">Precio desde</h2>
              <p className="text-2xl font-bold text-amber-600">20€</p>
              <p className="text-sm text-gray-500">por plaza</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Información del trayecto Barcelona → Valencia</h2>

            <div className="prose prose-gray max-w-none space-y-4">
              <p>
                La ruta <strong>Barcelona-Valencia</strong> es una de las conexiones más importantes del arco mediterráneo español. 
                Con ViajeSeguro, este trayecto se convierte en una experiencia cómoda y asequible. Nuestros conductores 
                profesionales recorren la AP-7, la autopista que conecta ambas ciudades en línea recta, sin desvíos 
                ni paradas innecesarias.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Puntos de recogida en Barcelona</h3>
              <p>
                Ofrecemos varios puntos de recogida en Barcelona para mayor comodidad:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Sants Estació</strong> — junto a la salida principal</li>
                <li><strong>Plaça Catalunya</strong> — centro de Barcelona</li>
                <li><strong>Aeropuerto de Barcelona (BCN)</strong> — Terminal 1 y 2</li>
                <li><strong>Zona Universitària</strong> — salida de la ciudad</li>
                <li><strong>Puntos intermedios</strong> según acuerdo con el conductor</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Horarios orientativos</h3>
              <p>
                Ofrecemos salidas programadas durante todo el día, con mayor frecuencia en horarios de mañana 
                (8:00-10:00) y tarde (16:00-19:00). Al reservar, podrás ver todas las opciones disponibles 
                para tu fecha y elegir la que mejor se adapte a tus planes.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Ventajas frente al tren o autobús</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Precio:</strong> Desde 20€, más barato que el AVE (35-60€) y el autobús (25-35€)</li>
                <li><strong>Comodidad:</strong> Vehículo privado, sin cambios de transporte, sin aglomeraciones</li>
                <li><strong>Flexibilidad:</strong> Varios horarios disponibles, cancelación gratuita hasta 24h antes</li>
                <li><strong>Directo:</strong> Sin paradas intermedias, viaje puerta a puerta</li>
                <li><strong>Seguridad:</strong> Conductores verificados, seguro incluido, valoraciones reales</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">¿Por qué elegir coche compartido?</h3>
              <p>
                El coche compartido es la alternativa inteligente al transporte tradicional. Compartes vehículo 
                con otros viajeros que hacen tu misma ruta, reduces el coste del viaje y contribuyes a una 
                movilidad más sostenible. En ViajeSeguro nos aseguramos de que todos los viajeros tengan una 
                experiencia positiva, con conductores de confianza y un sistema de valoraciones que garantiza 
                la calidad del servicio.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reseñas de viajeros</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-700">&ldquo;Viajé de Barcelona a Valencia por solo 20€. Cómodo, puntual y el conductor muy profesional. Repetiré sin duda.&rdquo;</p>
                <p className="text-xs text-gray-500 mt-2">— Laura M.</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-700">&ldquo;Mucho mejor que el autobús. Salida puntual desde Sants y en 3.5h estábamos en Valencia. Muy recomendable.&rdquo;</p>
                <p className="text-xs text-gray-500 mt-2">— Carlos R.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Barcelona → Valencia
            </h2>
            <p className="text-white/90 mb-6 text-lg">Desde 20€ • Conductor profesional • Sin cancelaciones</p>
            <Link
              href={`/search2?${searchParams.toString()}`}
              className="inline-block bg-white text-amber-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-amber-50 transition shadow-lg"
            >
              Reservar ahora
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
            <div className="space-y-4">
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Cuánto cuesta el coche compartido de Barcelona a Valencia?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  El precio del coche compartido de Barcelona a Valencia con ViajeSeguro empieza desde 20€ por plaza. El precio puede variar según la modalidad elegida: compartido, semiexclusivo o exclusivo. No hay cargos ocultos, el seguro está incluido en el precio.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Cuánto tarda el viaje de Barcelona a Valencia?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  El trayecto de Barcelona a Valencia tiene una duración aproximada de 3 horas y 30 minutos, recorriendo unos 350 km por la AP-7. El tiempo puede variar ligeramente según las condiciones de tráfico y el punto de recogida exacto.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Dónde me recogen en Barcelona?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Ofrecemos recogida en diferentes puntos de Barcelona: Sants Estació, Plaça Catalunya, Aeropuerto de Barcelona (BCN), Zona Universitària y otros puntos acordados con el conductor. Durante la reserva podrás seleccionar el punto más conveniente para ti.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Puedo cancelar mi viaje de Barcelona a Valencia?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Sí, ViajeSeguro ofrece cancelación gratuita hasta 24 horas antes de la salida con reembolso del 100%. Si cancelas con menos de 24 horas de antelación, el reembolso dependerá de tu plan de suscripción.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Es más barato que el tren o el autobús?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Sí, el coche compartido con ViajeSeguro desde 20€ es significativamente más barato que el AVE (que suele costar entre 35€ y 60€) y competitivo frente al autobús (desde 25€), pero con la ventaja de un vehículo privado, sin paradas intermedias y con horarios flexibles.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Los conductores están verificados?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Sí, todos los conductores de ViajeSeguro pasan por un proceso de verificación que incluye validación de identidad, licencia de conducir vigente, documentación del vehículo y seguro. Además, contamos con un sistema de valoraciones que garantiza la calidad del servicio.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViajeBarcelonaValencia;
