import type { Metadata } from "next";
import LoginPage from "@/components/public/auth/LoginPage";
import React from "react";

export const metadata: Metadata = {
  title: "Iniciar sesión | ViajeSeguro – Accede a tu cuenta",
  description:
    "Accede a tu cuenta de ViajeSeguro para publicar viajes, gestionar reservas y disfrutar de tu experiencia de carpooling.",
  keywords: ["login ViajeSeguro", "acceder cuenta", "carpooling"],
  openGraph: {
    title: "Iniciar sesión | ViajeSeguro – Accede a tu cuenta",
    description:
      "Entra en tu perfil de ViajeSeguro para gestionar tus viajes compartidos de forma segura.",
    url: "https://viajeseguro.site/auth/login",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/login.jpg",
        width: 1200,
        height: 630,
        alt: "Formulario de inicio de sesión ViajeSeguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iniciar sesión | ViajeSeguro – Accede a tu cuenta",
    description:
      "Entra en tu perfil de ViajeSeguro para gestionar tus viajes compartidos de forma segura.",
    images: ["https://viajeseguro.site/main/login.jpg"],
  },
};

import { Suspense } from "react";

const LogIn = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginPage />
    </Suspense>
  );
};

export default LogIn;
