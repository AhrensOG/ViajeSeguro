import AdminPage from "@/components/admin/AdminPage";
import { Suspense } from "react";

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
