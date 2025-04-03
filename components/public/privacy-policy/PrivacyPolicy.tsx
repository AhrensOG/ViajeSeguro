import React from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div>
      <NavBar />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>

        <p className="mb-4">
          En Viaje Seguro, valoramos su privacidad y nos comprometemos a
          proteger sus datos personales. Esta política explica cómo recopilamos,
          usamos y protegemos su información cuando utiliza nuestros servicios.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Información que recopilamos
        </h2>
        <p className="mb-4">
          Podemos recopilar información personal como su nombre, dirección de
          correo electrónico, número de teléfono, y datos de pago cuando usted
          se registra o utiliza nuestros servicios.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. Uso de la información
        </h2>
        <p className="mb-4">
          Utilizamos su información para procesar reservas, mejorar la
          experiencia del usuario, enviar notificaciones relevantes, y cumplir
          con obligaciones legales. No vendemos ni compartimos su información
          con terceros no autorizados.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Cookies</h2>
        <p className="mb-4">
          Utilizamos cookies y tecnologías similares para analizar el tráfico,
          personalizar el contenido y mejorar nuestros servicios. Usted puede
          configurar su navegador para rechazar las cookies si lo desea.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Almacenamiento y seguridad
        </h2>
        <p className="mb-4">
          Almacenamos sus datos en servidores seguros y aplicamos medidas de
          seguridad técnicas y organizativas para protegerlos contra el acceso
          no autorizado, la pérdida o la destrucción.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          5. Derechos del usuario
        </h2>
        <p className="mb-4">
          Usted tiene derecho a acceder, rectificar o eliminar sus datos
          personales, así como a oponerse al tratamiento o solicitar la
          portabilidad de los mismos. Puede ejercer estos derechos
          contactándonos directamente.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          6. Cambios en esta política
        </h2>
        <p className="mb-4">
          Podemos actualizar esta política de privacidad ocasionalmente. Le
          notificaremos cualquier cambio importante a través de nuestros canales
          habituales. El uso continuado del servicio implica la aceptación de
          las modificaciones.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Contacto</h2>
        <p className="mb-4">
          Si tiene preguntas o inquietudes sobre esta política, puede
          escribirnos a{" "}
          <span className="text-blue-600 underline">
            soporte@viajeseguro.site
          </span>
          .
        </p>

        <p className="mt-10 text-sm text-gray-500">
          Última actualización: 3 de abril de 2025
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
