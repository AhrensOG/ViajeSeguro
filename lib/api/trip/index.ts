import { SearchTripDto } from "@/lib/client/trip/types/trip.types";
import { CreateTripPayload, Trip } from "./trip.types";

export const createTrip = async (data: CreateTripPayload): Promise<Trip> => {
  const res = await fetch('/api/trip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Error al crear el viaje');
  return res.json();
};

export const getTrips = async (): Promise<Trip[]> => {
  const res = await fetch('/api/trip');
  if (!res.ok) throw new Error('Error al obtener los viajes');
  return res.json();
};

export const getTripById = async (id: string): Promise<Trip> => {
  const res = await fetch(`/api/trip/${id}`);
  if (!res.ok) throw new Error('Viaje no encontrado');
  return res.json();
};

export const searchTrips = async (query: SearchTripDto): Promise<Trip[]> => {
  const params = new URLSearchParams({
    origin: query.origin,
    destination: query.destination,
    departure: query.departure,
    serviceType: query.serviceType,
  });

  const res = await fetch(`/api/trip/search?${params.toString()}`, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('No se pudo buscar viajes');

  return res.json();
};
