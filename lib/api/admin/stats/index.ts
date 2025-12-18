
import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";

export interface DashboardStats {
    totalUsers: number;
    totalDrivers: number;
    totalTrips: number;
    totalReferrals: number;
    revenue: {
        total: number;
        byMethod: Record<string, number>;
    };
    tripsStatus: {
        status: string;
        count: number;
    }[];
}

export async function fetchAdminStats() {
    return await fetchWithAuth<DashboardStats>(`${BACKEND_URL}/stats/admin`);
}
