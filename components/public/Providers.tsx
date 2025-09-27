"use client";

import { SessionProvider } from "next-auth/react";
import PhoneReminderModal from "@/components/common/PhoneReminderModal";
import FloatingWhatsAppButton from "@/components/common/FloatingWhatsAppButton";

interface Props {
    children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
    return (
        <SessionProvider>
            {children}
            <PhoneReminderModal />
            <FloatingWhatsAppButton />
        </SessionProvider>
    );
};

export default Providers;
