import { fetcher } from "@/lib/functions";
import { CreateReservationPayload, ReservationConfirmationResponse } from "./reservation.types";
import { BACKEND_URL } from "@/lib/constants";

export const createReservation = async (
  payload: CreateReservationPayload
): Promise<ReservationConfirmationResponse> => {
  return fetcher<ReservationConfirmationResponse>(`${BACKEND_URL}/reservation`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
