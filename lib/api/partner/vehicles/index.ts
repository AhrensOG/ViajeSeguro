import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { Vehicle, CreateVehicleDto } from "../../admin/vehicles/vehicles.type";

export async function getUserVehicles(): Promise<Vehicle[]> {
    // Usar el endpoint específico para vehículos del usuario autenticado
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/user-vehicles`) as Vehicle[];
}

export async function getUserVehicleById(id: string): Promise<Vehicle> {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/user-vehicle/${id}`);
}

export async function updateUserVehicle(id: string, vehicleData: CreateVehicleDto): Promise<Vehicle> {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/user-vehicle/${id}`, {
        method: "PUT",
        body: JSON.stringify(vehicleData),
    });
}

export async function deleteUserVehicle(id: string) {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/user-vehicle/${id}`, {
        method: "DELETE",
    });
}
