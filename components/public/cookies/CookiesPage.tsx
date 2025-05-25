import React from "react";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";

const CookiesPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-custom-white-50 text-custom-black-900">
      <NavBar />
      <main className="flex-grow px-6 py-12 max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-custom-black-800">
          Política de Cookies
        </h1>

        <section className="space-y-4 text-custom-gray-700">
          <p>
            En <strong>Viaje Seguro</strong> utilizamos cookies con el objetivo
            de mejorar la experiencia del usuario, garantizar el correcto
            funcionamiento del sitio y ofrecer servicios personalizados.
          </p>

          <h2 className="text-xl font-semibold text-custom-black-800">
            ¿Qué son las cookies?
          </h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu
            navegador cuando visitas un sitio web. Su finalidad es recordar
            información sobre tu visita, como tus preferencias o el idioma
            seleccionado.
          </p>

          <h2 className="text-xl font-semibold text-custom-black-800">
            Tipos de cookies que utilizamos
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cookies esenciales:</strong> necesarias para el correcto
              funcionamiento de la plataforma. Por ejemplo, para mantener tu
              sesión iniciada.
            </li>
            <li>
              <strong>Cookies de terceros:</strong> utilizadas por servicios
              integrados como <em>Google Maps</em> para mostrar ubicaciones en
              nuestro sitio.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-custom-black-800">
            ¿Cómo puedes gestionar tus preferencias?
          </h2>
          <p>
            Puedes aceptar, rechazar o personalizar tus preferencias de cookies
            en cualquier momento utilizando nuestro{" "}
            <strong>panel de consentimiento</strong> que aparece al visitar el
            sitio o desde la configuración de tu navegador.
          </p>

          <h2 className="text-xl font-semibold text-custom-black-800">
            Cookies de terceros
          </h2>
          <p>
            Algunos servicios que integramos, como Google Maps, pueden
            establecer cookies propias para gestionar su funcionalidad. No
            tenemos control directo sobre estas cookies, pero siempre
            solicitaremos tu consentimiento antes de cargarlas.
          </p>

          <h2 className="text-xl font-semibold text-custom-black-800">
            Más información
          </h2>
          <p>
            Para más detalles sobre cómo tratamos tus datos personales, consulta
            nuestra{" "}
            <a
              href="/politicas-de-privacidad"
              className="text-custom-golden-600 hover:underline">
              Política de Privacidad
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPage;
