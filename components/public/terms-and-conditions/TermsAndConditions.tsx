import React from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";

const TermsAndConditionsPage = () => {
  return (
    <div>
      <NavBar />
      <main className="max-w-6xl mx-auto py-4 pt-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>

        <p className="mb-4">
          Bienvenido a Viaje Seguro. Al utilizar nuestros servicios, usted
          acepta los siguientes términos y condiciones. Le recomendamos leerlos
          detenidamente antes de continuar con el uso de la plataforma.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Uso del servicio</h2>
        <p className="mb-4">
          Viaje Seguro proporciona una plataforma para ayudar a los usuarios a
          planificar, organizar y gestionar sus viajes. Usted se compromete a
          utilizar nuestros servicios únicamente con fines legales y de acuerdo
          con estos términos.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. Registro y seguridad
        </h2>
        <p className="mb-4">
          Para acceder a ciertas funcionalidades, es posible que deba crear una
          cuenta. Usted es responsable de mantener la confidencialidad de sus
          credenciales y acepta notificarnos de inmediato si detecta un uso no
          autorizado de su cuenta.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Limitación de responsabilidad
        </h2>
        <p className="mb-4">
          Viaje Seguro no se responsabiliza por pérdidas directas, indirectas,
          incidentales o consecuentes que puedan surgir del uso de nuestros
          servicios. No garantizamos la disponibilidad continua o libre de
          errores del servicio.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Modificaciones</h2>
        <p className="mb-4">
          Nos reservamos el derecho de modificar estos términos en cualquier
          momento. Las modificaciones serán efectivas desde su publicación en
          nuestro sitio. El uso continuo del servicio implica su aceptación.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Ley aplicable</h2>
        <p className="mb-4">
          Estos términos se rigen por la legislación vigente en el país donde
          operamos. En caso de disputa, las partes se someterán a los tribunales
          competentes de dicha jurisdicción.
        </p>

        <p className="mt-10 text-sm text-gray-500">
          Última actualización: 3 de abril de 2025
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;
