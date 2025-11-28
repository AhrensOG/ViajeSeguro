import ResetPasswordPage from "@/components/public/auth/ResetPasswordPage";
import React from "react";

import { Suspense } from "react";

const ResetPassword = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
};

export default ResetPassword;
