import type { Metadata } from "next";
import ResetPasswordPage from "@/components/public/auth/ResetPasswordPage";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  robots: { index: false, follow: false },
};

const ResetPassword = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
};

export default ResetPassword;
