import { BACKEND_URL } from "@/lib/constants";
import { fetcher } from "@/lib/functions";

export interface VehicleSearch {
    capacity?: number;
    vehicleOfferType?: string;
    availableFrom: string;
    availableTo: string;
}

export const searchVehicleOffers = async (query: VehicleSearch) => {
    const params = new URLSearchParams();

    if (query.capacity) params.append("capacity", String(query.capacity));
    if (query.vehicleOfferType) params.append("vehicleOfferType", query.vehicleOfferType);
    params.append("availableFrom", query.availableFrom);
    params.append("availableTo", query.availableTo);

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
