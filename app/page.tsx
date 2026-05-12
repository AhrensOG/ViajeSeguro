import type { Metadata } from "next";
import HomePage from "@/components/public/home/HomePage";

export const metadata: Metadata = {
  title: "Coche Compartido Barcelona Valencia desde 20€ | ViajeSeguro",
  description:
    "Reserva tu plaza de coche compartido entre Barcelona y Valencia desde 20€. Viaje directo en 3.5h, conductor profesional, sin cancelaciones hasta 24h antes.",
  openGraph: {
    title: "Coche Compartido Barcelona Valencia desde 20€ | ViajeSeguro",
    description:
      "Reserva tu plaza de coche compartido entre Barcelona y Valencia desde 20€. Viaje directo en 3.5h, conductor profesional, sin cancelaciones hasta 24h antes.",
    url: "https://viajeseguro.site",
  },
  twitter: {
    title: "Coche Compartido Barcelona Valencia desde 20€ | ViajeSeguro",
    description:
      "Reserva tu plaza de coche compartido entre Barcelona y Valencia desde 20€. Viaje directo en 3.5h, conductor profesional, sin cancelaciones hasta 24h antes.",
  },
};

export default function Home() {
  return <HomePage />;
}
