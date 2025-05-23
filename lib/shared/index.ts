import { BACKEND_URL } from "../constants";
import { fetchWithAuth } from "../functions";

export async function getReduceUser() {
    const res = await fetchWithAuth(`${BACKEND_URL}/user/all-reduced`);
    if (!Array.isArray(res)) throw new Error("La respuesta de usuarios no es un array");
    return res;
}
