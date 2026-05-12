import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, MapPin, Euro, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Coche Compartido Valencia a Barcelona desde 20€ | ViajeSeguro",
  description:
    "Viaja de Valencia a Barcelona en coche compartido desde 20€. Salidas diarias, recogida en Valencia ciudad, 3.5h de trayecto directo, conductor profesional y seguro incluido. Reserva online.",
  openGraph: {
    title: "Coche Compartido Valencia a Barcelona desde 20€ | ViajeSeguro",
    description:
      "Viaja de Valencia a Barcelona en coche compartido desde 20€. Salidas diarias, 3.5h de trayecto, conductor profesional.",
    url: "https://viajeseguro.site/viaje-valencia-barcelona",
    images: [{ url: "https://viajeseguro.site/main/plaza.jpeg", width: 1200, height: 630, alt: "Coche compartido Valencia a Barcelona" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coche Compartido Valencia a Barcelona desde 20€ | ViajeSeguro",
    description:
      "Viaja de Valencia a Barcelona en coche compartido desde 20€. Salidas diarias, 3.5h de trayecto, conductor profesional.",
    images: ["https://viajeseguro.site/main/plaza.jpeg"],
  },
  alternates: { canonical: "https://viajeseguro.site/viaje-valencia-barcelona" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Coche compartido Valencia a Barcelona",
  description: "Servicio de coche compartido de Valencia a Barcelona. Viaje directo de 3.5h, desde 20€ por plaza, con conductor profesional y seguro incluido.",
  provider: {
    "@type": "Organization",
    name: "ViajeSeguro",
    url: "https://viajeseguro.site",
  },
  areaServed: [
    { "@type": "City", name: "Valencia" },
    { "@type": "City", name: "Barcelona" },
  ],
  offers: {
    "@type": "Offer",
    price: "20",
    priceCurrency: "EUR",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    url: "https://viajeseguro.site/viaje-valencia-barcelona",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto cuesta el coche compartido de Valencia a Barcelona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El precio del coche compartido de Valencia a Barcelona con ViajeSeguro empieza desde 20€ por plaza. Ofrecemos diferentes modalidades: compartido (20€), semiexclusivo y exclusivo para adaptarnos a tus necesidades. El seguro está incluido en todos los precios.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tarda el viaje de Valencia a Barcelona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El trayecto de Valencia a Barcelona tiene una duración aproximada de 3 horas y 30 minutos, recorriendo unos 350 km por la AP-7. Es un viaje directo sin paradas intermedias, mucho más rápido que el autobús convencional.",
      },
    },
    {
      "@type": "Question",
      name: "¿Dónde me recogen en Valencia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ofrecemos recogida en varios puntos de Valencia: Estación del Norte, Plaza de la Reina, Aeropuerto de Valencia (VLC), Zona de la Ciudad de las Artes y las Ciencias, y otros puntos acordados. En el proceso de reserva podrás elegir la ubicación más cómoda.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo llevar equipaje en el coche compartido?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, cada pasajero puede llevar una maleta mediana y un bolso de mano sin coste adicional. Si necesitas llevar equipaje extra, puedes contactar con el conductor antes de la reserva para confirmar el espacio disponible.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué ventajas tiene frente al AVE o autobús?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El coche compartido Valencia-Barcelona desde 20€ es más económico que el AVE (35-60€) y ofrece mayor comodidad que el autobús. Viajas en un vehículo privado con aire acondicionado, sin paradas, con flexibilidad horaria y cancelación gratuita hasta 24h antes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo hago la reserva de Valencia a Barcelona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Reservar es muy sencillo: entra en viajeseguro.site, selecciona Valencia como origen y Barcelona como destino, elige tu fecha y hora, escoge tu plaza y completa el pago online. Recibirás la confirmación al instante por email.",
      },
    },
  ],
};

const ViajeValenciaBarcelona = () => {
  const searchParams = new URLSearchParams({
    origin: "Valencia",
    destination: "Barcelona", serviceType: "SIMPLE_TRIP", mode: "car",
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
            <Link href="/viaje-barcelona-valencia" className="hover:text-amber-600 transition">Barcelona a Valencia</Link>
            <ChevronRight className="inline w-3 h-3 mx-1" />
            <span className="text-gray-800 font-medium">Valencia a Barcelona</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Coche compartido Valencia a Barcelona
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            Viaja de Valencia a Barcelona en coche compartido desde solo <strong>20€</strong> con ViajeSeguro. 
            Un trayecto directo de <strong>350 km</strong> por la AP-7 con una duración de aproximadamente <strong>3 horas y media</strong>. 
            Disfruta de la comodidad de un vehículo privado sin preocuparte de la gasolina, los peajes ni el estrés de conducir. 
            Reserva tu plaza desde casa, elige tu punto de recogida en Valencia y llega a Barcelona relajado, 
            por menos de lo que cuesta un café en el AVE.
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
            <h2 className="text-xl font-bold text-gray-900 mb-6">Información del trayecto Valencia → Barcelona</h2>

            <div className="prose prose-gray max-w-none space-y-4">
              <p>
                La ruta <strong>Valencia-Barcelona</strong> es uno de los corredores más transitados de la costa mediterránea. 
                Con ViajeSeguro, viajarás por la AP-7 en un vehículo cómodo y con aire acondicionado, acompañado de 
                otros viajeros con tu mismo destino. Nuestros conductores profesionales conocen la ruta a la perfección 
                y te llevarán sin desvíos ni paradas innecesarias.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Puntos de recogida en Valencia</h3>
              <p>
                Puedes elegir tu punto de salida en Valencia entre estas ubicaciones:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Estación del Norte</strong> — centro histórico de Valencia</li>
                <li><strong>Plaza de la Reina</strong> — junto a la Catedral</li>
                <li><strong>Aeropuerto de Valencia (VLC)</strong> — salidas adaptadas a vuelos</li>
                <li><strong>Ciudad de las Artes y las Ciencias</strong> — zona moderna de Valencia</li>
                <li><strong>Puntos acordados</strong> según disponibilidad del conductor</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Horarios orientativos</h3>
              <p>
                Contamos con salidas programadas a lo largo del día. Los horarios más demandados son los de primera hora 
                de la mañana (7:00-9:00) para quienes viajan por trabajo, y los de media tarde (15:00-18:00) para 
                viajes de ocio o visita familiar. En la pantalla de búsqueda podrás ver todas las opciones disponibles.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">Ventajas de ViajeSeguro frente a otras opciones</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Ahorro:</strong> Desde 20€ frente a los 35-60€ del AVE</li>
                <li><strong>Conductor profesional:</strong> No conduces tú, disfruta del trayecto</li>
                <li><strong>Sin paradas:</strong> Viaje directo, no como el autobús que para en Castellón y Tarragona</li>
                <li><strong>Flexibilidad:</strong> Cancelación gratuita hasta 24h antes del viaje</li>
                <li><strong>Seguridad:</strong> Seguro de viaje incluido, conductores verificados</li>
                <li><strong>Sostenibilidad:</strong> Compartir coche reduce emisiones y descongestiona las carreteras</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6">¿Merece la pena el coche compartido Valencia-Barcelona?</h3>
              <p>
                Si comparas precios, el coche compartido es imbatible: por 20€ llegas de Valencia a Barcelona en 3.5h, 
                mientras que el AVE cuesta entre 35€ y 60€ y el autobús entre 25€ y 35€. Además, viajas en un entorno 
                más privado y agradable, sin las aglomeraciones del tren ni el olor del autobús. Los pasajeros que ya 
                han viajado con nosotros valoran la experiencia con un 4.8 sobre 5. ¡Pruébalo y repite!
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
                <p className="text-sm text-gray-700">&ldquo;Viajo cada semana de Valencia a Barcelona por trabajo y ViajeSeguro me ha cambiado la vida. Puntual, cómodo y económico.&rdquo;</p>
                <p className="text-xs text-gray-500 mt-2">— Marta G.</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-700">&ldquo;Me encanta poder reservar online y pagar con tarjeta. El conductor fue súper amable y el viaje muy tranquilo. 100% recomendable.&rdquo;</p>
                <p className="text-xs text-gray-500 mt-2">— Javier P.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Valencia → Barcelona
            </h2>
            <p className="text-white/90 mb-6 text-lg">Desde 20€ • Conductor profesional • Sin cancelaciones</p>
            <Link
              href={`/search?${searchParams.toString()}`}
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
                  ¿Cuánto cuesta el coche compartido de Valencia a Barcelona?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  El precio del coche compartido de Valencia a Barcelona con ViajeSeguro empieza desde 20€ por plaza. Ofrecemos diferentes modalidades: compartido (20€), semiexclusivo y exclusivo para adaptarnos a tus necesidades. El seguro está incluido en todos los precios.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Cuánto tarda el viaje de Valencia a Barcelona?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  El trayecto de Valencia a Barcelona tiene una duración aproximada de 3 horas y 30 minutos, recorriendo unos 350 km por la AP-7. Es un viaje directo sin paradas intermedias, mucho más rápido que el autobús convencional.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Dónde me recogen en Valencia?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Ofrecemos recogida en varios puntos de Valencia: Estación del Norte, Plaza de la Reina, Aeropuerto de Valencia (VLC), Zona de la Ciudad de las Artes y las Ciencias, y otros puntos acordados. En el proceso de reserva podrás elegir la ubicación más cómoda.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Puedo llevar equipaje en el coche compartido?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Sí, cada pasajero puede llevar una maleta mediana y un bolso de mano sin coste adicional. Si necesitas llevar equipaje extra, puedes contactar con el conductor antes de la reserva para confirmar el espacio disponible.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Qué ventajas tiene frente al AVE o autobús?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  El coche compartido Valencia-Barcelona desde 20€ es más económico que el AVE (35-60€) y ofrece mayor comodidad que el autobús. Viajas en un vehículo privado con aire acondicionado, sin paradas, con flexibilidad horaria y cancelación gratuita hasta 24h antes.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Cómo hago la reserva de Valencia a Barcelona?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Reservar es muy sencillo: entra en viajeseguro.site, selecciona Valencia como origen y Barcelona como destino, elige tu fecha y hora, escoge tu plaza y completa el pago online. Recibirás la confirmación al instante por email.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViajeValenciaBarcelona;
