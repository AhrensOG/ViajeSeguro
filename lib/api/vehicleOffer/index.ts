import { BACKEND_URL } from "@/lib/constants";
import { fetcher } from "@/lib/functions";

export interface VehicleSearch {
    capacity: number;
    vehicleOfferType: string;
    availableFrom: string;
    availableTo: string;
}

export const searchVehicleOffers = async (query: VehicleSearch) => {
    const params = new URLSearchParams({
        // withdrawLocation: query.withdrawLocation,
        capacity: String(query.capacity),
        vehicleOfferType: query.vehicleOfferType,
        availableFrom: query.availableFrom,
        availableTo: query.availableTo,
    });

    return fetcher(`${BACKEND_URL}/vehicle-offer/search?${params.toString()}`);
};

export const fetchVehicleOffer = async (id: string) => {
    try {
        const res = await fetcher(`${BACKEND_URL}/vehicle-offer/${id}`);
        return res;
    } catch {
        throw new Error("Error fetching vehicle offer");
    }
};
