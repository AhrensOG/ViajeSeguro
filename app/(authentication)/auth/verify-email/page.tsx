import type { Metadata } from "next";
import VerifyEmailPage from "@/components/public/auth/VerifyEmailPage";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verificar email",
  robots: { index: false, follow: false },
};

const VerifyEmail = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <VerifyEmailPage />
        </Suspense>
    );
};

export default VerifyEmail;
