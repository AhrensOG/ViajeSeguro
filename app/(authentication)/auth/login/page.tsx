import LoginPage from "@/components/public/auth/LoginPage";
import React, { Suspense } from "react";

const LogIn = () => {
  return (
    <Suspense fallback={<div></div>}>
      <LoginPage />{" "}
    </Suspense>
  );
};

export default LogIn;
