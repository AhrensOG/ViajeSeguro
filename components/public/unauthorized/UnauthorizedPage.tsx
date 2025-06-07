import React from "react";
import Link from "next/link";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import { ShieldAlert, Home } from "lucide-react";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Acceso no autorizado
        </h1>
        <p className="text-gray-600 max-w-md mb-6">
          Lo sentimos, no tenés permisos para acceder a esta sección de la
          aplicación. Si creés que esto es un error, contactá con el soporte de
          Viaje Seguro.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <span className="inline-flex items-center gap-2 bg-custom-golden-600 text-white px-5 py-2 rounded-md hover:bg-custom-golden-700 transition">
              <Home className="w-4 h-4" />
              Ir al inicio
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
