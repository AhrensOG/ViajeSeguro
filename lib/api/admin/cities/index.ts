import { fetchWithAuth, fetcher } from "@/lib/functions";
import { CreateCityRequest, CityResponse, UpdateCityRequest } from "./cities.type";
import { BACKEND_URL } from "@/lib/constants";

export async function createCity(data: CreateCityRequest): Promise<CityResponse> {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/cities`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return res as CityResponse;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to create city");
    }
}

export async function getAllCities() {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/cities`);
        if (!Array.isArray(res)) throw new Error("La respuesta del backend no es un array de ciudades");
        return res;
    } catch {
        throw new Error("Error al cargar las ciudades");
    }
}

export async function updateCity(id: string, data: UpdateCityRequest) {
    try {
        const response = await fetchWithAuth(`${BACKEND_URL}/cities/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        return response;
    } catch {
        throw new Error("Failed to update city");
    }
}

export async function getActiveCities(): Promise<CityResponse[]> {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/cities/active`);
        if (!Array.isArray(res)) throw new Error("La respuesta del backend no es un array de ciudades");
        return res as CityResponse[];
    } catch {
        throw new Error("Error al cargar las ciudades activas");
    }
}

export async function getActiveCitiesPublic(): Promise<CityResponse[]> {
    try {
        const res = await fetcher(`${BACKEND_URL}/cities/active`);
        if (!Array.isArray(res)) throw new Error("La respuesta del backend no es un array de ciudades");
        return res as CityResponse[];
    } catch {
        throw new Error("Error al cargar las ciudades activas");
    }
}

export async function deleteCity(id: string) {
    try {
        const res = await fetchWithAuth(`${BACKEND_URL}/cities/${id}`, {
            method: "DELETE",
        });
        if (!res) {
            throw new Error("Error al eliminar la ciudad");
        }
        return res;
    } catch {
        throw new Error("Error al eliminar la ciudad");
    }
}
