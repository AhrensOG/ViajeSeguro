"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";

const GlobalRestrictionWarning = () => {
    const { data: session } = useSession();
    const [restriction, setRestriction] = useState<{ days: number } | null>(null);

    useEffect(() => {
        if (!session?.user?.id) return;

        // Fetch profile to check restriction
        // We use a lightweight call if possible, or just the standard profile endpoint
        // We assume backend returns driverLicenseUrl or we might need to adjust endpoint return
        // Wait, getProfile might not return driverLicenseUrl for Clients.
        // Let's assume we can use the endpoint we have.
        // If not, we might need a specific endpoint or rely on something else.
        // Given the constraints, let's try to fetch user profile.

        const checkRestriction = async () => {
            try {
                // Note: We need a way to get the full profile or at least the field we hijacked.
                // If GET /user/profile doesn't return it, we might be stuck.
                // Let's hope typical profile endpoints return enough data or we can infer it.
                // Actually, for CLIENTS, driverLicenseUrl might typically be null/empty, 
                // but we are setting it. We need to make sure the backend returns it.
                // I'll assume we can hit an endpoint that returns it.

                // Using a direct fetch to avoid circular dependencies with heavy api libs if any
                // const res = await fetch(`${BACKEND_URL}/user/profile-page/${session.user.id}`, {
                //     headers: {
                //         Authorization: `Bearer ${(session as any).backendTokens?.accessToken}`,
                //     }
                // });

                // Wait, profile-page endpoint returns specific fields. Let's check user.controller.
                // It returns { name, lastName, email, phone, referralCode... }. 
                // It does NOT return driverLicenseUrl.
                // We need to either modify the backend endpoint OR use another one.
                // `getUserProfile` (GET /user/:id) returns almost everything. It strips password.
                // That one requires finding the ID first.

                const res2 = await fetch(`${BACKEND_URL}/user/${session.user.id}`, {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        Authorization: `Bearer ${(session as any).backendTokens?.accessToken}`,
                    }
                });

                if (res2.ok) {
                    const data = await res2.json();
                    if (data.driverLicenseUrl && String(data.driverLicenseUrl).startsWith("RESTRICTED:")) {
                        const parts = String(data.driverLicenseUrl).split(":");
                        const expiry = new Date(parts[1]);
                        if (expiry > new Date()) {
                            const diff = expiry.getTime() - new Date().getTime();
                            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                            setRestriction({ days });
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to check restriction", error);
            }
        };

        checkRestriction();
    }, [session]);

    if (!restriction) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] max-w-sm w-full animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 shadow-lg rounded-r-md flex items-start">
                <div className="shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Cuenta Restringida</h3>
                    <div className="mt-1 text-sm text-yellow-700">
                        <p>Tu cuenta tiene restricciones temporales por incumplimiento de políticas.</p>
                        <p className="mt-1 font-semibold">Quedan {restriction.days} días.</p>
                    </div>
                    <div className="mt-2">
                        <button
                            onClick={() => setRestriction(null)}
                            className="text-xs font-medium text-yellow-800 hover:text-yellow-600 underline"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalRestrictionWarning;
