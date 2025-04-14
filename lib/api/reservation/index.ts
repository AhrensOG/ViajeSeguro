import { fetcher, fetchWithAuth } from "@/lib/functions";
import { CreateReservationPayload, ReservationConfirmationResponse, ReservationResponse } from "./reservation.types";
import { BACKEND_URL } from "@/lib/constants";

export const createReservation = async (
  payload: CreateReservationPayload
): Promise<ReservationConfirmationResponse> => {
  return fetchWithAuth<ReservationConfirmationResponse>(`${BACKEND_URL}/reservation`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getReservationsByUser = async (
  userId: string
): Promise<ReservationResponse[]> => {
  return fetcher<ReservationResponse[]>(
    `${BACKEND_URL}/reservation/by-user/${userId}`
  );
};

export const getReservationById = async (
  id: string
): Promise<ReservationResponse> => {
  return fetcher<ReservationResponse>(
    `${BACKEND_URL}/reservation/by-id-for-qr-detail/${id}`
  );
};
