import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { CreateVehicleOfferRequest, VehicleOffersAdminResponse } from "./vehicleOffers.types";

async function fetchVehicleOffers() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-offer/admin/all`);
        return res;
    } catch {
        throw new Error("Error fetching vehicle offers");
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

async function fetchSimpleVehicles() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle/simple-all`);
        return res;
    } catch {
        throw new Error("Error fetching simple vehicles");
    }
}

async function createVehicleOffer(data: CreateVehicleOfferRequest): Promise<VehicleOffersAdminResponse> {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-offer`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return res as VehicleOffersAdminResponse;
    } catch {
        throw new Error("Error creating vehicle offer");
    }
}

async function updateVehicleOffer(id: string, data: CreateVehicleOfferRequest) {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-offer/update`, {
            method: "PUT",
            body: JSON.stringify({ ...data, offerId: id }),
        });
        return res;
    } catch {
        throw new Error("Error updating vehicle offer");
    }
}

async function updateUserVehicleOffer(id: string, data: CreateVehicleOfferRequest) {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-offer/user-update`, {
            method: "PUT",
            body: JSON.stringify({ ...data, offerId: id }),
        });
        return res;
    } catch {
        throw new Error("Error updating user vehicle offer");
    }
}

async function deleteVehicleOffer(id: string) {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-offer/${id}`, {
            method: "DELETE",
        });
        return res;
    } catch {
        throw new Error("Error deleting vehicle offer");
    }
}

export { fetchVehicleOffers, fetchSimpleUsers, fetchSimpleVehicles, createVehicleOffer, updateVehicleOffer, updateUserVehicleOffer, deleteVehicleOffer };
