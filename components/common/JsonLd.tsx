const JsonLd = () => {
  const organization = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "ViajeSeguro",
    url: "https://viajeseguro.site",
    logo: "https://viajeseguro.site/main/logo.png",
    description:
      "Coche compartido entre Barcelona y Valencia desde 20€. Sin cancelaciones, con seguro incluido.",
    telephone: "+34624051168",
    foundingDate: "2019",
    areaServed: ["Barcelona", "Valencia", "España"],
    sameAs: [
      "https://www.facebook.com/share/19AbLyVubk/",
      "https://www.instagram.com/viaje_seguro_es",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
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
          "https://viajeseguro.site/search2?origin={origin}&destination={destination}&serviceType=SIMPLE_TRIP&mode=car",
      },
      "query-input": "required name=origin",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
};

export default JsonLd;
