import AdminPage from "@/components/admin/AdminPage";
import { Suspense } from "react";

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminPage />
        </Suspense>
    );
}
