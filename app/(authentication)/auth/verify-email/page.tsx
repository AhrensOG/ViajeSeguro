import VerifyEmailPage from "@/components/public/auth/VerifyEmailPage";
import React from "react";

import { Suspense } from "react";

const VerifyEmail = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <VerifyEmailPage />
        </Suspense>
    );
};

export default VerifyEmail;
