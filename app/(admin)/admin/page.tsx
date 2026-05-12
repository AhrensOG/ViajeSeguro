import type { Metadata } from "next";
import AdminPage from "@/components/admin/AdminPage";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

const Admin = () => {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <AdminPage />
        </Suspense>
    );
};

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Admin />
        </Suspense>
    );
}
