import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { User } from "../../reservation/reservation.types";
import { SimpleUser, UserAdminResponse, UserFormData } from "./userPanel.types";

export async function fetchUsersData(banned: boolean = false): Promise<User[]> {
    try {
        const query = banned ? "?banned=true" : "";
        const res = await fetchWithAuth<User[]>(`${BACKEND_URL}/user/all${query}`, {
            method: "GET",
        });
        return res;
    } catch (error) {
        throw new Error(`Error al obtener el perfil del usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function updateUserData(userId: string, data: Partial<UserAdminResponse>): Promise<User> {
    try {
        const res = await fetchWithAuth<User>(`${BACKEND_URL}/user/update/${userId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        return res;
    } catch (error) {
        throw new Error(`Error al actualizar el perfil del usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function createUser(data: UserFormData): Promise<SimpleUser> {
    try {
        const res = await fetchWithAuth(BACKEND_URL + "/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return res as SimpleUser;
    } catch (error) {
        throw new Error(`${error instanceof Error ? error : String(error)}`);
    }
}

export async function deleteUser(userId: string, days?: number): Promise<void> {
    try {
        const query = days ? `?days=${days}` : "";
        await fetchWithAuth(`${BACKEND_URL}/user/delete/${userId}${query}`, {
            method: "DELETE",
        });
    } catch (error) {
        throw new Error(`Error al eliminar el usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function restoreUser(userId: string): Promise<void> {
    try {
        await fetchWithAuth(`${BACKEND_URL}/user/restore/${userId}`, {
            method: "PUT",
        });
    } catch (error) {
        throw new Error(`Error al restaurar el usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}
