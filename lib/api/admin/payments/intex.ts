import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { CreatePaymentFormData } from "./payments.type";

export async function getPayments() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/payment/all`);
        if (!Array.isArray(res)) {
            throw new Error("Error al cargar los pagos");
        }
        return res;
    } catch {
        throw new Error("Error al cargar los pagos");
    }
}

export async function getReduceReservation() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/reservation/reduce`);
        if (!Array.isArray(res)) {
            throw new Error("Error al cargar las reservas");
        }
        return res;
    } catch {
        throw new Error("Error al cargar las reservas");
    }
}

export async function getUserReduceWhitReservations() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/user/reduce-with-reservations`);
        if (!Array.isArray(res)) {
            throw new Error("Error al cargar los usuarios");
        }
        return res;
    } catch {
        throw new Error("Error al cargar los usuarios");
    }
}

export async function createPayment(data: CreatePaymentFormData) {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/payment`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        if (!res) {
            throw new Error("Error al crear el pago");
        }
        return res;
    } catch {
        throw new Error("Error al crear el pago");
    }
}

export async function updatePayment(id: string, data: CreatePaymentFormData) {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/payment/update/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
        if (!res) {
            throw new Error("Error al actualizar el pago");
        }
        return res;
    } catch {
        throw new Error("Error al actualizar el pago");
    }
}
