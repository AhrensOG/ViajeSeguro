"use client";

import NavBar from "../navigation/NavBar";
import HeroMinimal from "./HeroMinimal";
import RoutesCompact from "./RoutesCompact";
import BenefitsMinimal from "./BenefitsMinimal";
import HowItWorks from "./HowItWorks";
import PaymentMethods from "./PaymentMethods";
import CTAMinimal from "./CTAMinimal";
import Footer from "../navigation/Footer";

const Home2Page = () => {
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
            Viaja en coche compartido entre Barcelona, Valencia y Madrid
          </h2>
          <div className="text-slate-600 space-y-4 leading-relaxed">
            <p>
              <strong>ViajeSeguro</strong> es la plataforma de <strong>coche compartido</strong> que conecta Barcelona, Valencia y Madrid con viajes directos, conductores profesionales y precios desde 20€. Olvídate de las cancelaciones de última hora: todos nuestros viajes están garantizados con salida asegurada.
            </p>
            <p>
              Nuestras rutas principales: <strong>Barcelona a Valencia</strong> (3.5h, desde 20€), <strong>Valencia a Barcelona</strong> (3.5h, desde 20€), <strong>Madrid a Valencia</strong> (3.5h, desde 25€) y <strong>Madrid a Barcelona</strong> (3.5h, desde 25€). Todas incluyen seguro de viaje, conductor profesional y la flexibilidad de cancelar hasta 24 horas antes sin coste.
            </p>
            <p>
              Viajar en coche compartido con ViajeSeguro te ofrece la comodidad de un vehículo privado por el precio de un transporte público. Sin esperas, sin transbordos y con salidas desde puntos céntricos de cada ciudad. Además, nuestro sistema de valoraciones garantiza la calidad y confianza de toda nuestra comunidad de viajeros.
            </p>
            <p>
              Reserva tu plaza en minutos, paga de forma segura (tarjeta, PayPal o efectivo) y disfruta de un viaje cómodo y directo. Si viajas con frecuencia, únete a nuestros planes de fidelidad y ahorra hasta 12€ por trayecto.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home2Page;
