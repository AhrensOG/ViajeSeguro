import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { CreateVehicleDto, Vehicle } from "./vehicles.type";
import { User } from "../../reservation/reservation.types";

export async function getVehicles(): Promise<Vehicle[]> {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle`);
}

export async function getOwners(): Promise<User[]> {
    return await fetchWithAuth(`${BACKEND_URL}/user/owners`);
}

export async function getVehicleById(id: string): Promise<Vehicle> {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/${id}`);
}

export async function createVehicle(vehicleData: CreateVehicleDto): Promise<Vehicle> {
    const res = await fetchWithAuth(`${BACKEND_URL}/vehicle`, {
        method: "POST",
        body: JSON.stringify(vehicleData),
    });
    return res as Vehicle;
}

export async function updateVehicle(id: string, vehicleData: CreateVehicleDto): Promise<Vehicle> {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/${id}`, {
        method: "PUT",
        body: JSON.stringify(vehicleData),
    });
}

export async function deleteVehicle(id: string) {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/${id}`, {
        method: "DELETE",
    });
}

export async function approveVehicle(id: string, reason?: string): Promise<Vehicle> {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/${id}/approve`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
    });
}

export async function rejectVehicle(id: string, reason?: string): Promise<Vehicle> {
    return await fetchWithAuth(`${BACKEND_URL}/vehicle/${id}/reject`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
    });
}
