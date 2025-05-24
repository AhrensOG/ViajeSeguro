import Link from "next/link";
import React from "react";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-custom-black-800 text-custom-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1 */}
          <div>
            <Link
              href="/"
              className="font-bold text-2xl flex items-center text-custom-white-100 mb-4">
              <span>Viaje</span>
              <span className="text-custom-golden-600">Seguro</span>
            </Link>
            <p className="text-custom-gray-500 mb-4">
              Conectando viajeros, creando experiencias.
            </p>

            {/* Iconos sociales debajo del texto */}
            <div className="flex gap-7 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-custom-golden-500 transition-colors"
                aria-label="Facebook">
                <Facebook size={32} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-custom-golden-500 transition-colors"
                aria-label="Instagram">
                <Instagram size={32} />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-custom-golden-500 transition-colors"
                aria-label="Mensaje directo">
                <MessageCircle size={32} />
              </a>
            </div>
          </div>

          {/* Columna 2 */}
          <div>
            <h3 className="text-custom-white-100 font-medium mb-4">
              Servicios
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-custom-gray-500 hover:text-custom-golden-500">
                  Venta de plazas
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-custom-gray-500 hover:text-custom-golden-500">
                  Próximamente: Alquiler de vehículos
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-custom-gray-500 hover:text-custom-golden-500">
                  Próximamente: Arma tu propio viaje
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h3 className="text-custom-white-100 font-medium mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-custom-gray-500 hover:text-custom-golden-500">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-custom-gray-500 hover:text-custom-golden-500">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-custom-gray-500 hover:text-custom-golden-500">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h3 className="text-custom-white-100 font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terminos-y-condiciones"
                  className="text-custom-gray-500 hover:text-custom-golden-500">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/politicas-de-privacidad"
                  className="text-custom-gray-500 hover:text-custom-golden-500">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-custom-gray-500 hover:text-custom-golden-500">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-custom-gray-800 mt-12 pt-6 text-center text-custom-gray-500">
          <p>
            © {new Date().getFullYear()} Viaje Seguro. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
