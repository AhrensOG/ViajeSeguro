import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className=" py-8 mt-auto border-t border-fourth-gray">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <span className="text-lg font-bold text-first-gray">
              Viaje Seguro
            </span>
          </div>

          <nav className="flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="#servicios"
              className="text-second-gray hover:text-first-gray transition-colors"
              aria-label="Ver servicios">
              Servicios
            </Link>
            <Link
              href="#rutas"
              className="text-second-gray hover:text-first-gray transition-colors"
              aria-label="Ver rutas">
              Rutas
            </Link>
            <Link
              href="#precios"
              className="text-second-gray hover:text-first-gray transition-colors"
              aria-label="Ver precios">
              Precios
            </Link>
            <Link
              href="#contacto"
              className="text-second-gray hover:text-first-gray transition-colors"
              aria-label="Ver contacto">
              Contacto
            </Link>
            <Link
              href="/terminos-y-condiciones"
              className="text-second-gray hover:text-first-gray transition-colors"
              aria-label="Ver términos y condiciones">
              Términos y condiciones
            </Link>
            <Link
              href="/politicas-de-privacidad"
              className="text-second-gray hover:text-first-gray transition-colors"
              aria-label="Ver términos y condiciones">
              Politicas de privacidad
            </Link>
          </nav>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          © 2025 Viaje Seguro. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
