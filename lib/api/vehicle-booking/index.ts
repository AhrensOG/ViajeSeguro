import { BACKEND_URL } from "@/lib/constants";
import { fetcher, fetchWithAuth } from "@/lib/functions";
import { CreateVehicleBookingPayload, ResponseForQrPage, VehicleOfferWithVehicle } from "./vehicleBooking.types";

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
        bookings: res.bookings,
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

const fetchVehicleBookingWhitDetails = async (id: string) => {
    const res = await fetcher<ResponseForQrPage>(`${BACKEND_URL}/vehicle-booking/details/${id}`);
    return res;
};

const markBookingAsPaid = async (id: string) => {
    const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${id}/paid`, {
        method: "PATCH",
    });
    return res;
};

const markBookingAsDelivered = async (id: string) => {
  const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${id}/mark-delivered`, {
    method: 'PATCH',
  });
  return res;
}

const confirmBookingPickup = async (id: string) => {
  const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${id}/confirm-pickup`, {
    method: 'PATCH',
  });
  return res;
}

const markAsReturned = async (id: string) => {
  const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${id}/mark-returned`, {
    method: 'PATCH',
  });
  return res;
}

const confirmVehicleReturn = async (id: string) => {
  const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/${id}/confirm-return`, {
    method: 'PATCH',
  });
  return res;
}

const getVehicleBookingsForProfile = async (id: string) => {
    const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/by-user/${id}`, {
        method: "GET",
    });
    return res;
};

const getPartnerEarnings = async () => {
    const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/partner/earnings`, {
        method: "GET",
    });
    return res;
};

const getPartnerUpcomingBookings = async () => {
    const res = await fetchWithAuth(`${BACKEND_URL}/vehicle-booking/partner/upcoming`, {
        method: "GET",
    });
    return res;
};


export {
    fetchOffer,
    createVehicleBooking,
    fetchVehicleBooking,
    fetchVehicleBookingWhitDetails,
    getVehicleBookingsForProfile,
    getPartnerEarnings,
    getPartnerUpcomingBookings,
    markBookingAsPaid,
    markBookingAsDelivered,
    confirmBookingPickup,
    markAsReturned,
    confirmVehicleReturn,
};
