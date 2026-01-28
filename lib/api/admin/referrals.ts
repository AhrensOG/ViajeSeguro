import { fetchWithAuth } from "@/lib/functions";
import { BACKEND_URL } from "@/lib/constants";

export interface Referral {
    id: string;
    referrerId: string;
    referredId: string;
    rewardStatus: "PENDING" | "AVAILABLE" | "USED";
    createdAt: string;
    referrer: {
        id: string;
        name: string;
        lastName: string;
        email: string;
        _count: {
            referralsFrom: number;
        };
    };
    referred: {
        id: string;
        name: string;
        lastName: string;
        email: string;
        _count: {
            reservations: number;
        };
    };
}

export async function fetchReferrals(): Promise<Referral[]> {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/user/referrals`);
        if (!Array.isArray(res)) throw new Error("La respuesta no es un array");
        return res;
    } catch (error) {
        console.error("Error fetching referrals:", error);
        return [];
    }
}
