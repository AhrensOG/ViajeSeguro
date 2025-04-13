import { BACKEND_URL } from "@/lib/constants";

type CreateCchekoutSessionPayload = {
  amount: number;
  metadata?: Record<string, any>;
};

export const createCheckoutSession = async (payload: CreateCchekoutSessionPayload) => {
  const response = await fetch(`${BACKEND_URL}/stripe/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Error al crear la sesión de Checkout");

  return await response.json();
};
