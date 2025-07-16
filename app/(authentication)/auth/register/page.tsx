import type { Metadata } from "next";
import RegisterPage from "@/components/public/auth/RegisterPage";
import React from "react";

export const metadata: Metadata = {
  title: "Registro | ViajeSeguro – Crea tu cuenta de coche compartido",
  description:
    "Regístrate en ViajeSeguro y empieza a compartir viajes (carpooling) entre Madrid, Barcelona y Valencia. Publica rutas o reserva plazas fácilmente.",
  keywords: ["registro ViajeSeguro", "crear cuenta", "coche compartido"],
  openGraph: {
    title: "Registro | ViajeSeguro – Crea tu cuenta de coche compartido",
    description:
      "Únete a ViajeSeguro para compartir viajes o reservar plaza en rutas Madrid–Barcelona–Valencia de forma segura.",
    url: "https://viajeseguro.site/auth/register",
    type: "website",
    images: [
      {
        url: "https://viajeseguro.site/main/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Formulario de registro de ViajeSeguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Registro | ViajeSeguro – Crea tu cuenta de coche compartido",
    description:
      "Únete a ViajeSeguro para compartir viajes o reservar plaza en rutas Madrid–Barcelona–Valencia de forma segura.",
    images: ["https://viajeseguro.site/main/logo.jpg"],
  },
};

const Register = () => {
  return <RegisterPage />;
};

export default Register;
