import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { Vehicle, CreateVehicleDto } from "../../admin/vehicles/vehicles.type";

export async function getUserVehicles(): Promise<Vehicle[]> {
    // Usar el endpoint general de vehículos que ya funciona
    // El backend filtrará automáticamente por el usuario autenticado
    const allVehicles = await fetchWithAuth(`${BACKEND_URL}/vehicle`) as Vehicle[];
    
    // Si el backend no filtra automáticamente, podríamos filtrar aquí
    // pero por ahora asumimos que el backend maneja la autorización correctamente
    return allVehicles;
}

export async function getUserVehicleById(id: string): Promise<Vehicle> {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/user-vehicle/${id}`);
}

export async function updateUserVehicle(id: string, vehicleData: CreateVehicleDto): Promise<Vehicle> {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/${id}`, {
        method: "PUT",
        body: JSON.stringify(vehicleData),
    });
}

export async function deleteUserVehicle(id: string) {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/user-vehicle/${id}`, {
        method: "DELETE",
    });
}
