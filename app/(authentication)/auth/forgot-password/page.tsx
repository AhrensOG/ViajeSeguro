import type { Metadata } from "next";
import ForgotPasswordPage from '@/components/public/auth/ForgotPasswordPage'

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

const ForgotPassword = () => {
  return (
    <ForgotPasswordPage/>
  )
}

export default ForgotPassword