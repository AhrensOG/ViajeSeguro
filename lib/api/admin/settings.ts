import { fetchWithAuth } from "@/lib/functions";
import { BACKEND_URL } from "@/lib/constants";

const API_URL = BACKEND_URL;

export async function getGlobalSettings() {
    return fetchWithAuth(`${API_URL}/settings`);
}

export async function getGlobalSetting(key: string) {
    return fetchWithAuth(`${API_URL}/settings/${key}`);
}

export async function updateGlobalSetting(key: string, value: string) {
    return fetchWithAuth(`${API_URL}/settings/${key}`, {
        method: "PATCH",
        body: JSON.stringify({ value }),
    });
}
