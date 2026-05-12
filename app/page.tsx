import type { Metadata } from "next";
import Home2Page from "@/components/public/home2/Home2Page";

export const metadata: Metadata = {
  title: "Coche Compartido Barcelona, Valencia y Madrid | ViajeSeguro",
  description:
    "Viaja en coche compartido entre Barcelona, Valencia y Madrid desde 20€. Conductor profesional, sin cancelaciones, seguro incluido. Reserva en minutos.",
  openGraph: {
    title: "Coche Compartido Barcelona, Valencia y Madrid | ViajeSeguro",
    description:
      "Viaja en coche compartido entre Barcelona, Valencia y Madrid desde 20€. Conductor profesional, sin cancelaciones, seguro incluido.",
    url: "https://viajeseguro.site",
  },
  twitter: {
    title: "Coche Compartido Barcelona, Valencia y Madrid | ViajeSeguro",
    description:
      "Viaja en coche compartido entre Barcelona, Valencia y Madrid desde 20€. Conductor profesional, sin cancelaciones, seguro incluido.",
  },
};

export default function Home() {
  return <Home2Page />;
}
