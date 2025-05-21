import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { User } from "../../reservation/reservation.types";

export async function fetchUsersData(): Promise<User[]> {
    try {
        const res = await fetchWithAuth<User[]>(`${BACKEND_URL}/user/all`, {
            method: "GET",
        });
        return res;
    } catch (error) {
        throw new Error(`Error al obtener el perfil del usuario: ${error instanceof Error ? error.message : String(error)}`);
    }
}
