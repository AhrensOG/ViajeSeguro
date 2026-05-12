import type { Metadata } from "next";
import CookiesPage from "@/components/public/cookies/CookiesPage";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Conoce cómo ViajeSeguro utiliza las cookies para mejorar tu experiencia. Política de cookies de nuestra plataforma de viaje compartido.",
};

const Cookies = () => {
  return <CookiesPage />;
};

export default Cookies;
