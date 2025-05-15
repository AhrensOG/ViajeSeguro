import { fetchWithAuth } from "@/lib/functions";
import { ChangePasswordFormValues, UserProfile } from "./clientProfile.types";
import { BACKEND_URL } from "@/lib/constants";

export async function fetchUserData(id: string): Promise<UserProfile> {
    try {
        const res = await fetchWithAuth<UserProfile>(`${BACKEND_URL}/user/${id}`, {
            method: "GET",
        });
        return res;
    } catch (error) {
        throw new Error(`Error al obtener el perfil del usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function updateProfile(values: UserProfile): Promise<void> {
    try {
        if (values.referralCodeFrom) {
            await updateReferred(values.referralCodeFrom);
            return;
        }
        await fetchWithAuth(`${BACKEND_URL}/user/update`, {
            method: "PUT",
            body: JSON.stringify({
                name: values.name,
                lastName: values.lastName,
            }),
        });
    } catch (error) {
        throw new Error(`Error al obtener el perfil del usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function updateReferred(code: string): Promise<void> {
    try {
        await fetchWithAuth(`${BACKEND_URL}/user/update-referred`, {
            method: "PUT",
            body: JSON.stringify({
                code: code,
            }),
        });
    } catch (error) {
        console.log(error);

        throw new Error(`Error al obtener el perfil del usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function changePassword(values: ChangePasswordFormValues): Promise<void> {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/user/change-password`, {
            method: "PUT",
            body: JSON.stringify({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            }),
        });
        console.log("Respuesta del servidor:", res);
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
    }
}
