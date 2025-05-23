import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { CreateReservationFormData } from "./reservation.types";

export async function getReduceTrip() {
    const res = await fetchWithAuth(`${BACKEND_URL}/trip/reduced-all`);
    if (!Array.isArray(res)) throw new Error("La respuesta de viajes no es un array");
    return res;
}

export async function getAllReservations() {
    const res = await fetchWithAuth(`${BACKEND_URL}/reservation/all`);
    if (!Array.isArray(res)) throw new Error("La respuesta de reservas no es un array");
    return res;
}

export async function createReservation(data: CreateReservationFormData, id: string): Promise<void> {
    try {
        await fetchWithAuth(`${BACKEND_URL}/reservation/create-by-admin/${id}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    } catch {
        throw new Error("Error al crear la reserva");
    }
}

export async function updateReservation(data: CreateReservationFormData): Promise<void> {
    try {
        await fetchWithAuth(`${BACKEND_URL}/reservation/${data.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    } catch {
        throw new Error("Error al actualizar la reserva");
    }
}
