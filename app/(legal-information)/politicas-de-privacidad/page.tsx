import type { Metadata } from "next";
import PrivacyPolicyPage from "@/components/public/privacy-policy/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de ViajeSeguro. Conoce cómo tratamos tus datos personales en nuestra plataforma de viaje compartido.",
};

const PrivacyPolicy = () => {
  return <PrivacyPolicyPage />;
};

export default PrivacyPolicy;
