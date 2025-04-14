import { fetcher } from "@/lib/functions";
import { BACKEND_URL } from "@/lib/constants";

type MarkQrAsUsedResponse = {
  success: boolean;
  message: string;
};

export const markQrAsUsed = async (qrId: string): Promise<MarkQrAsUsedResponse> => {
  return fetcher<MarkQrAsUsedResponse>(`${BACKEND_URL}/qr/use/${qrId}`, {
    method: "PATCH",
  });
};