import { BACKEND_URL } from "@/lib/constants";
import { CreateReservationPayload } from "../reservation/reservation.types";
import { fetchWithAuth } from "@/lib/functions";
import { CreateSubscriptionPayload } from "../subscriptions/subscriptions.types";
import { CreateVehicleBookingPayload } from "../vehicle-booking/vehicleBooking.types";

type CreateCheckoutSessionPayload = {
    amount: number;
    metadata?: CreateReservationPayload | CreateSubscriptionPayload | CreateVehicleBookingPayload;
};

export const createCheckoutSession = async (payload: CreateCheckoutSessionPayload) => {
    return await fetchWithAuth<{ url: string }>(`${BACKEND_URL}/stripe/create-checkout-session`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
    });
};
