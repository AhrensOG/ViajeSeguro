export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const CITIES = [
  { value: "valencia", label: "Valencia, España" },
  { value: "madrid", label: "Madrid, España" },
  { value: "barcelona", label: "Barcelona, España" },
];

export const SERVICES = [
  { value: "SIMPLE_TRIP", label: "Viaje simple" },
  { value: "RENTAL_WITH_DRIVER", label: "Viaje con chofer" },
  { value: "RENTAL_WITHOUT_DRIVER", label: "Viaje sin chofer" },
];