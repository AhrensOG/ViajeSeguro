import { BACKEND_URL } from "@/lib/constants";
import { fetcher, fetchWithAuth } from "@/lib/functions";
import { CreateVehicleBookingPayload, VehicleOfferWithVehicle } from "./vehicleBooking.types";

const fetchOffer = async (id: string) => {
    const res = await fetcher<VehicleOfferWithVehicle>(`${BACKEND_URL}/vehicle-offer/${id}`);

    if (!res || !res.vehicle) {
        throw new Error("Vehicle data is missing in the response");
    }
    const formatedOffer = {
        id: res.id,
        pricePerDay: res.pricePerDay,
        availableFrom: res.availableFrom,
        availableTo: res.availableTo,
        originalTimeZone: res.originalTimeZone,
        withdrawLocation: res.withdrawLocation,
        returnLocation: res.returnLocation,
        vehicleOfferType: res.vehicleOfferType,
        vehicle: {
            id: res.vehicle.id,
            capacity: res.vehicle.capacity,
            model: res.vehicle.model,
            brand: res.vehicle.brand,
            year: res.vehicle.year,
            fuelType: res.vehicle.fuelType,
            transmissionType: res.vehicle.transmissionType,
            features: res.vehicle.features,
            images: res.vehicle.images,
        },
    };

    return formatedOffer;
};
const fetchVehicleBooking = async (id: string) => {
    const res = await fetcher<VehicleOfferWithVehicle>(`${BACKEND_URL}/vehicle-booking/${id}`);
    return res;
};

const createVehicleBooking = async (payload: CreateVehicleBookingPayload) => {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
        return res;
    } catch {
        throw new Error("Error creating vehicle booking");
    }
};

export { fetchOffer, fetchVehicleBooking, createVehicleBooking };
