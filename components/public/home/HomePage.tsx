"use client";

import NavBar from "../navigation/NavBar";
import HeroMinimal from "./HeroMinimal";
import RoutesCompact from "./RoutesCompact";
import BenefitsMinimal from "./BenefitsMinimal";
import HowItWorks from "./HowItWorks";
import PaymentMethods from "./PaymentMethods";
import CTAMinimal from "./CTAMinimal";
import Footer from "../navigation/Footer";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <NavBar />
      <HeroMinimal />
      <RoutesCompact />
      <BenefitsMinimal />
      <HowItWorks />
      <PaymentMethods />
      <CTAMinimal />

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Coche compartido Barcelona ↔ Valencia desde 20€
          </h2>
          <div className="text-slate-600 space-y-4 leading-relaxed">
            <p>
              <strong>ViajeSeguro</strong> es la plataforma de <strong>coche compartido</strong> que conecta Barcelona y Valencia con viajes directos, conductores profesionales y precios desde 20€. Olvídate de las cancelaciones de última hora: todos nuestros viajes están garantizados con salida asegurada y conductor profesional.
            </p>
            <p>
              Nuestra ruta principal: <strong>Barcelona a Valencia</strong> (3.5h, desde 20€) y <strong>Valencia a Barcelona</strong> (3.5h, desde 20€). Todas las plazas incluyen seguro de viaje, conductor profesional verificado y la flexibilidad de cancelar hasta 24 horas antes sin coste alguno.
            </p>
            <p>
              Viajar en coche compartido con ViajeSeguro te ofrece la comodidad de un vehículo privado por el precio de un transporte público. Sin esperas, sin transbordos y con salidas desde puntos céntricos tanto en Barcelona como en Valencia. Además, nuestro sistema de valoraciones garantiza la calidad y confianza de toda nuestra comunidad de viajeros.
            </p>
            <p>
              Reserva tu plaza en minutos, paga de forma segura (tarjeta, PayPal o efectivo) y disfruta de un viaje cómodo y directo entre Barcelona y Valencia. Si viajas con frecuencia, únete a nuestros planes de fidelidad y ahorra hasta 12€ por trayecto. Descubre por qué miles de viajeros eligen ViajeSeguro para sus desplazamientos entre Barcelona y Valencia.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
