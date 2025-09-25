import { fetchWithAuth } from "@/lib/functions";
import { CreateTripRequest, TripResponse, UpdateTripRequest } from "./trips.type";
import { BACKEND_URL } from "@/lib/constants";

type WeekKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface CreateTripsBulkPayload {
  origin: string;
  destination: string;
  originalTimeZone: string;
  basePrice: number;
  capacity?: number;
  minPassengers?: number;
  visible?: boolean;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FINISHED' | string;
  originLocation?: string;
  destinationLocation?: string;
  driverId: string;
  dateStart: string; // YYYY-MM-DD
  dateEnd: string;   // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime: string;   // HH:mm
  weekdays?: WeekKey[];
}

export async function createTrip(data: CreateTripRequest): Promise<TripResponse> {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/trip`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return res as TripResponse;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to create trip");
    }
}

export async function createTripsBulk(data: CreateTripsBulkPayload): Promise<TripResponse[]> {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/trip/bulk`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return res as TripResponse[];
    } catch (error) {
        console.log(error);
        throw new Error("Failed to create trips in bulk");
    }
}

export async function getDrivers() {
    try {
        const response = await fetchWithAuth(`${BACKEND_URL}/user/drivers`, {
            method: "GET",
        });
        return response;
    } catch {
        throw new Error("Failed to fetch drivers");
    }
}

export async function getPartners() {
    try {
        const response = await fetchWithAuth(`${BACKEND_URL}/user/owners`, {
            method: "GET",
        });
        return response;
    } catch {
        throw new Error("Failed to fetch owners");
    }
}

export async function updateTrip(data: UpdateTripRequest) {
    try {
        const response = await fetchWithAuth(`${BACKEND_URL}/trip/${data.id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        return response;
    } catch {
        throw new Error("Failed to update trip");
    }
}

export async function getAllTrips() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/trip/all`);
        if (!Array.isArray(res)) throw new Error("La respuesta del backend no es un array de viajes");
        return res;
    } catch {
        throw new Error("Error al cargar los viajes");
    }
}

export async function deleteTrip(id: string) {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/trip/delete/${id}`, {
            method: "DELETE",
        });
        if (!res) {
            throw new Error("Error al eliminar el viaje");
        }
        return res;
    } catch {
        throw new Error("Error al eliminar el viaje");
    }
}
