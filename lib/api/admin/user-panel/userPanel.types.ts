export interface SimpleUser {
    name: string;
    lastName: string;
    avatarUrl: string;
    email: string;
    role: "ADMIN" | "CLIENT" | "DRIVER";
}

export interface UserResponse {
    id: string;
    name: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    role: "ADMIN" | "CLIENT" | "DRIVER";
}
