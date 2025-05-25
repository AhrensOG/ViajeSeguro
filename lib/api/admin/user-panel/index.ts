import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { User } from "../../reservation/reservation.types";
import { UserAdminResponse, UserFormData } from "./userPanel.types";

export async function fetchUsersData(): Promise<User[]> {
    try {
        const res = await fetchWithAuth<User[]>(`${BACKEND_URL}/user/all`, {
            method: "GET",
        });
        console.log(res);

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

export async function createUser(data: UserFormData): Promise<boolean> {
    try {
        const res = await fetch(BACKEND_URL + "/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al crear el usuario");
        }
        return true;
    } catch (error) {
        throw new Error(`Error al crear el usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function deleteUser(userId: string): Promise<void> {
    try {
        await fetchWithAuth(`${BACKEND_URL}/user/delete/${userId}`, {
            method: "DELETE",
        });
    } catch (error) {
        throw new Error(`Error al eliminar el usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}
