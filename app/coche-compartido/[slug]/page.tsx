import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, MapPin, Euro, Car, Shield, Calendar } from "lucide-react";

const RUTAS = [
  {
    slug: "barcelona-valencia",
    origin: "Barcelona",
    destination: "Valencia",
    price: "20",
    distancia: "355 km",
    duracion: "3h 30min",
    metaTitle: "Coche Compartido Barcelona Valencia desde 20€ | ViajeSeguro",
    metaDesc:
      "Viaja en coche compartido de Barcelona a Valencia desde 20€. Salidas diarias, recogida en tu zona, sin cancelaciones. Reserva ahora.",
    h1: "Coche Compartido Barcelona → Valencia desde 20€",
    intro:
      "Viaja de Barcelona a Valencia en coche compartido desde 20€ con ViajeSeguro. Salidas diarias, conductor profesional verificado, recogida en tu zona y política de cancelación flexible hasta 24h antes con reembolso del 100%. El trayecto cubre aproximadamente 355 km por la AP-7 en alrededor de 3 horas y 30 minutos.",
  },
  {
    slug: "valencia-barcelona",
    origin: "Valencia",
    destination: "Barcelona",
    price: "20",
    distancia: "355 km",
    duracion: "3h 30min",
    metaTitle: "Coche Compartido Valencia Barcelona desde 20€ | ViajeSeguro",
    metaDesc:
      "Viaja en coche compartido de Valencia a Barcelona desde 20€. Salidas diarias, recogida en tu zona, sin cancelaciones. Reserva ahora.",
    h1: "Coche Compartido Valencia → Barcelona desde 20€",
    intro:
      "Viaja de Valencia a Barcelona en coche compartido desde 20€ con ViajeSeguro. Conductor profesional, vehículo de hasta 8 plazas, recogida en Valencia ciudad o área metropolitana y llegada a Barcelona. Cancelación gratuita hasta 24h antes.",
  },
];

export async function generateStaticParams() {
  return RUTAS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ruta = RUTAS.find((r) => r.slug === slug);
  if (!ruta) return { title: "Ruta no encontrada" };

  return {
    title: ruta.metaTitle,
    description: ruta.metaDesc,
    alternates: { canonical: `https://viajeseguro.site/coche-compartido/${slug}` },
    openGraph: {
      title: ruta.metaTitle,
      description: ruta.metaDesc,
      url: `https://viajeseguro.site/coche-compartido/${slug}`,
      type: "website",
      images: [{ url: "https://viajeseguro.site/main/plaza.jpeg", width: 1200, height: 630, alt: ruta.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: ruta.metaTitle,
      description: ruta.metaDesc,
      images: ["https://viajeseguro.site/main/plaza.jpeg"],
    },
  };
}

const RoutePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const ruta = RUTAS.find((r) => r.slug === slug);
  if (!ruta) return <div className="p-8 text-center text-gray-500">Ruta no encontrada</div>;

  const taxiServiceSchema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: `Coche compartido ${ruta.origin} - ${ruta.destination}`,
    provider: {
      "@type": "Organization",
      name: "ViajeSeguro",
      url: "https://viajeseguro.site",
    },
    areaServed: [ruta.origin, ruta.destination],
    offers: {
      "@type": "Offer",
      price: ruta.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Cuánto cuesta el coche compartido de ${ruta.origin} a ${ruta.destination}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `El precio del coche compartido de ${ruta.origin} a ${ruta.destination} con ViajeSeguro empieza desde ${ruta.price}€ por plaza. El precio puede variar según la modalidad elegida: compartido, semiexclusivo o exclusivo.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Cuánto tarda el viaje de ${ruta.origin} a ${ruta.destination}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `El trayecto de ${ruta.origin} a ${ruta.destination} tiene una duración aproximada de ${ruta.duracion} y una distancia de ${ruta.distancia}. El tiempo puede variar según las condiciones de tráfico.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Puedo cancelar mi viaje de ${ruta.origin} a ${ruta.destination}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. ViajeSeguro ofrece cancelación gratuita hasta 24 horas antes de la salida con reembolso del 100%. Para cambios de fecha contacta con nuestro equipo por WhatsApp.",
        },
      },
    ],
  };

  const searchParams = new URLSearchParams({
    origin: ruta.origin,
    destination: ruta.destination,
    serviceType: "SIMPLE_TRIP",
    mode: "car",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(taxiServiceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-600 transition">Inicio</Link>
            <ChevronRight className="inline w-3 h-3 mx-1" />
            <span className="text-gray-800 font-medium">{ruta.origin} - {ruta.destination}</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{ruta.h1}</h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-10">{ruta.intro}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <MapPin className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Distancia</h3>
              <p className="text-2xl font-bold text-gray-800">{ruta.distancia}</p>
              <p className="text-sm text-gray-500">AP-7 / Autopista</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <Clock className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Duración</h3>
              <p className="text-2xl font-bold text-gray-800">{ruta.duracion}</p>
              <p className="text-sm text-gray-500">Tiempo estimado</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <Euro className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Precio desde</h3>
              <p className="text-2xl font-bold text-amber-600">{ruta.price}€</p>
              <p className="text-sm text-gray-500">por plaza</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del trayecto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                <div><span className="font-medium text-gray-900">Origen:</span><span className="text-gray-600 ml-1">{ruta.origin}</span></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                <div><span className="font-medium text-gray-900">Destino:</span><span className="text-gray-600 ml-1">{ruta.destination}</span></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Car className="w-5 h-5 text-amber-500 shrink-0" />
                <div><span className="font-medium text-gray-900">Vehículo:</span><span className="text-gray-600 ml-1">Hasta 8 plazas</span></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Shield className="w-5 h-5 text-amber-500 shrink-0" />
                <div><span className="font-medium text-gray-900">Seguro:</span><span className="text-gray-600 ml-1">Incluido</span></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                <div><span className="font-medium text-gray-900">Cancelación:</span><span className="text-gray-600 ml-1">Gratis hasta 24h antes</span></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Euro className="w-5 h-5 text-amber-500 shrink-0" />
                <div><span className="font-medium text-gray-900">Precio:</span><span className="text-gray-600 ml-1">Desde {ruta.price}€/plaza</span></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {ruta.origin} → {ruta.destination}
            </h2>
            <p className="text-white/90 mb-6 text-lg">Desde {ruta.price}€ • Conductor profesional • Sin cancelaciones</p>
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
                  ¿Cuánto cuesta el coche compartido de {ruta.origin} a {ruta.destination}?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  El precio del coche compartido de {ruta.origin} a {ruta.destination} con ViajeSeguro empieza desde {ruta.price}€ por plaza. El precio puede variar según la modalidad elegida: compartido, semiexclusivo o exclusivo.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Cuánto tarda el viaje de {ruta.origin} a {ruta.destination}?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  El trayecto de {ruta.origin} a {ruta.destination} tiene una duración aproximada de {ruta.duracion} y una distancia de {ruta.distancia}. El tiempo puede variar según las condiciones de tráfico.
                </p>
              </details>
              <details className="group border border-gray-200 rounded-xl p-4 open:border-amber-200 open:bg-amber-50/30">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Puedo cancelar mi viaje de {ruta.origin} a {ruta.destination}?
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  Sí. ViajeSeguro ofrece cancelación gratuita hasta 24 horas antes de la salida con reembolso del 100%. Para cambios de fecha contacta con nuestro equipo por WhatsApp.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoutePage;
