import type { Metadata } from "next";
import Home2Page from "@/components/public/home2/Home2Page";

export const metadata: Metadata = {
  title: "ViajeSeguro - Viaja barato entre ciudades",
  description: "Viaja entre Madrid, Barcelona y Valencia desde 27€. Comparte viaje y ahorra.",
};

export default function Home2() {
  return <Home2Page />;
}
