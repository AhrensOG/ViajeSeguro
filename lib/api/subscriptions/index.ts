import { fetchWithAuth } from "@/lib/functions";
import { CreateSubscriptionRequest } from "./subscriptions.types";
import { BACKEND_URL } from "@/lib/constants";

export async function createSubscription(data: CreateSubscriptionRequest) {
    try {
        const res = await fetchWithAuth(BACKEND_URL + "/subscription/create", {
            method: "POST",
            body: JSON.stringify(data),
        });
        console.log("Respuesta de la API:", res);
        return res;
    } catch (error) {
        console.error("Error al crear la suscripción:", error);
        throw new Error(`Error al crear la suscripción: ${error instanceof Error ? error.message : String(error)}`);
    }
}
