const JsonLd = () => {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ViajeSeguro",
    url: "https://viajeseguro.site",
    logo: "https://viajeseguro.site/main/logo.png",
    image: "https://viajeseguro.site/main/plaza.jpeg",
    description:
      "Coche compartido entre Barcelona y Valencia desde 20€. Sin cancelaciones, con seguro incluido.",
    telephone: "+34624051168",
    email: "ayuda@viajeseguro.com",
    foundingDate: "2019",
    areaServed: ["Barcelona", "Valencia", "España"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Barcelona",
      addressCountry: "ES",
    },
    sameAs: [
      "https://www.facebook.com/share/19AbLyVubk/",
      "https://www.instagram.com/viaje_seguro_es",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
    },
    priceRange: "€€",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ViajeSeguro",
    url: "https://viajeseguro.site",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://viajeseguro.site/search?origin={origin}&destination={destination}&serviceType=SIMPLE_TRIP&mode=car",
      },
      "query-input": "required name=origin",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
};

export default JsonLd;
