import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { CreateVehicleBookingRequest } from "./vehicleBookings.types";

async function fetchVehicleBookingsAdmin() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/admin/all`);
        return res;
    } catch {
        throw new Error("Error fetching vehicle bookings");
    }
}

async function fetchSimpleUsers() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/user/simple-all`);
        return res;
    } catch {
        throw new Error("Error fetching simple users");
    }
}

async function fetchSimpleOffers() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-offer/simple-all`);
        return res;
    } catch {
        throw new Error("Error fetching simple offers");
    }
}

async function createVehicleBooking(payload: CreateVehicleBookingRequest) {
    const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/admin`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return res;
}

async function deleteVehicleBooking(id: string) {
    const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${id}`, {
        method: "DELETE",
    });
    return res;
}

async function getSimpleVehicles() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle/simple-all`);
        return res;
    } catch {
        throw new Error("Error fetching simple vehicles");
    }
}

async function updateStatus(id: string, status: string) {
    const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${id}/${status}`, {
        method: "PATCH",
    });
    return res;
}

export {
    fetchVehicleBookingsAdmin,
    fetchSimpleUsers,
    fetchSimpleOffers,
    createVehicleBooking,
    deleteVehicleBooking,
    getSimpleVehicles,
    updateStatus,
};
