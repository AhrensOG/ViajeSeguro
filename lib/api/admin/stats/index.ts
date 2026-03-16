
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

export interface ReferralInfo {
    id: string;
    referrer: {
        id: string;
        name: string;
        lastName: string;
        email: string;
    };
    referred: {
        id: string;
        name: string;
        lastName: string;
        email: string;
    };
    rewardStatus: "PENDING" | "AVAILABLE" | "USED";
    createdAt: string;
    referredTripsCount: number;
    referredBookingsCount: number;
    totalReferralActivity: number;
    isRewardAvailable: boolean;
    isRewardUsed: boolean;
}

export interface ReferralStats {
    stats: {
        totalReferrals: number;
        pendingRewards: number;
        availableRewards: number;
        usedRewards: number;
        referralsWithAtLeastOneTrip: number;
    };
    referrals: ReferralInfo[];
}

export async function fetchAdminStats() {
    return await fetchWithAuth<DashboardStats>(`${BACKEND_URL}/stats/admin`);
}

export async function fetchReferralStats() {
    return await fetchWithAuth<ReferralStats>(`${BACKEND_URL}/stats/referrals`);
}
