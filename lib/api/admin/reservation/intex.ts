import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth, fetchWithOptionalAuth } from "@/lib/functions";
import { CreateReservationFormData, Discounts, ReservationResponse } from "./reservation.types";

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

export async function createReservation(data: CreateReservationFormData, id: string): Promise<ReservationResponse> {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/reservation/create-by-admin/${id}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return res as ReservationResponse;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error al crear la reserva");
    }
}

export async function updateReservation(data: CreateReservationFormData): Promise<ReservationResponse> {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/reservation/${data.id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        return res as ReservationResponse;
    } catch {
        throw new Error("Error al actualizar la reserva");
    }
}

export async function deleteRes(id: string) {
    try {
        await fetchWithAuth(`${BACKEND_URL}/reservation/delete/${id}`, {
            method: "DELETE",
        });
    } catch {
        throw new Error("Error al eliminar la reserva");
    }
}

export async function getDiscounts(): Promise<Discounts[]> {
    try {
        const res = await fetchWithOptionalAuth(`${BACKEND_URL}/discount/all`);
        return res as Discounts[];
    } catch {
        throw new Error("Error al obtener los descuentos");
    }
}
