export interface SimpleUser {
    id?: string;
    name: string;
    lastName: string;
    avatarUrl: string;
    email: string;
    role: "ADMIN" | "CLIENT" | "DRIVER";
    emailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserResponse {
    id: string;
    name: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    role: "ADMIN" | "CLIENT" | "DRIVER";
    createdAt: string;
    updatedAt: string;
    emailVerified: boolean;
}

export interface UserAdminResponse {
    id: string;
    avatarUrl: string | null;
    email: string;
    emailVerified: boolean;
    name: string;
    lastName: string;
    role: "CLIENT" | "DRIVER" | "ADMIN";
    isDriver: boolean;
    driverVerified: boolean;
    referralCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserFormData {
    name: string;
    lastName: string;
    email: string;
    role: "CLIENT" | "DRIVER" | "ADMIN";
    password?: string;
}

export interface UserEditFormData {
    name: string;
    lastName: string;
    role: "CLIENT" | "DRIVER" | "ADMIN";
}
