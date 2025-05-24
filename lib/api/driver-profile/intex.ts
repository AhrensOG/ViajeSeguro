import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";

export async function getTripsByDriverId() {
    return await fetchWithAuth(`${BACKEND_URL}/trip/for_driver`);
}

export async function getTripById(id: string) {
    return await fetchWithAuth(`${BACKEND_URL}/trip/${id}`);
}
