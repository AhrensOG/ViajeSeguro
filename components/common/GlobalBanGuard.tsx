"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import BanTimerModal from "@/components/common/BanTimerModal";
import { BASE_URL } from "@/lib/constants";

const GlobalBanGuard = () => {
    const { data: session } = useSession();
    const [bannedUntil, setBannedUntil] = useState<Date | null>(null);

    useEffect(() => {
        if (!session?.user?.id) return;

        const checkBanStatus = async () => {
            try {
                // Determine if we should check 'driver' endpoint or generic. 
                // Actually, accessing any protected endpoint might reveal the ban if we added a global guard on backend.
                // But specifically we implemented logic in /auth/login.
                // To be safe, let's hit a lightweight endpoint.

                // Note: If the session token is valid but the user is banned in DB, 
                // subsequent requests MIGHT fail if backend strategy checks DB every time.
                // Our backend 'validateUser' is only for login. 
                // 'JwtGuard' verifies signature but does NOT check DB for 'isDeleted' by default usually.
                // We typically need to handle the "Account Deleted" scenario globally.

                // Let's try to fetch own profile.
                const res = await fetch(`${BASE_URL}/user/${session.user.id}`, {
                    headers: { Authorization: `Bearer ${session.backendTokens.accessToken}` }
                });

                if (!res.ok) {
                    // Try to parse error
                    const errorText = await res.text();
                    try {
                        const errorObj = JSON.parse(errorText);
                        if (errorObj.message === 'User is temporarily banned' && errorObj.bannedUntil) {
                            setBannedUntil(new Date(errorObj.bannedUntil));
                            return;
                        }
                    } catch { }

                    // If 401/403 and seemingly not banned explicitly, maybe deleted?
                    if (res.status === 401 || res.status === 403) {
                        // Check if it's the specific "Permanently suspended" message?
                        if (errorText.includes("permanemente")) {
                            await signOut({ callbackUrl: "/auth/login", redirect: true });
                        }
                    }
                }

                // Also check if we receive a user object that has 'isDeleted' if backend returns it
                // (Backend 'findById' usually filters out deleted, so likely 404 or null)
            } catch (error) {
                console.error("Ban check failed", error);
            }
        };

        checkBanStatus();
    }, [session]);

    if (bannedUntil) {
        return (
            <BanTimerModal
                bannedUntil={bannedUntil}
                onClose={() => {
                    // Force signout on close, or just stay there?
                    // User said "non tiene que dejar hacer nada".
                    signOut({ callbackUrl: "/" });
                }}
            />
        );
    }

    return null;
};

export default GlobalBanGuard;
