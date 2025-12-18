export interface UserProfile {
    email: string;
    name: string;
    lastName: string;
    phone?: string;
    referralCode: string;
    referralCodeFrom?: string;
    referredByName?: string | null;
    referredCount?: number;
    referralsTo?: {
        referrer: {
            name: string;
            lastName: string;
        };
    }[];
    driverLicenseUrl?: string;
}

export interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        email: string;
        name: string;
        lastName: string;
    };
}
