import { BACKEND_URL } from "@/lib/constants";
import { CreateReservationPayload } from "../reservation/reservation.types";
import { fetchWithAuth } from "@/lib/functions";

type CreateCheckoutSessionPayload = {
  amount: number;
  metadata?: CreateReservationPayload;
};

export const createCheckoutSession = async (payload: CreateCheckoutSessionPayload) => {
  return await fetchWithAuth<{ url: string }>(
    `${BACKEND_URL}/stripe/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
