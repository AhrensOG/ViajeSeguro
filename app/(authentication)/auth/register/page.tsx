import RegisterPage from "@/components/public/auth/RegisterPage";
import React, { Suspense } from "react";

const Register = () => {
  return (
    <Suspense fallback={<div></div>}>
      <RegisterPage />;
    </Suspense>
  );
};

export default Register;
