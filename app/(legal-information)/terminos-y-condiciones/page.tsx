import type { Metadata } from "next";
import TermsAndConditionsPage from "@/components/public/terms-and-conditions/TermsAndConditions";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso de ViajeSeguro, la plataforma de viaje compartido entre Madrid, Barcelona y Valencia.",
};

const TermsAndConditions = () => {
  return <TermsAndConditionsPage />;
};

export default TermsAndConditions;
