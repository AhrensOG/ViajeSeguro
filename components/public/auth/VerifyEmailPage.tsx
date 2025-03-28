import React, { Suspense } from "react";
import VerifyEmailSkeleton from "./auxiliarComponents/verify-email/VerifyEmailSkeleton";
import VerifyEmailProcess from "./auxiliarComponents/verify-email/VerifyEmailProcess";

const VerifyEmailPage = () => {
    return (
        <Suspense fallback={<VerifyEmailSkeleton />}>
            <VerifyEmailProcess />
        </Suspense>
    );
};

export default VerifyEmailPage;
