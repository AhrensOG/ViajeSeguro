import { DateTime } from "luxon";

const formatDateToDDMMYYYY = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error("formatDateToDDMMYYYY: Fecha inválida", date);
        return "Fecha inválida";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

function formatDateToYYYYMMDD(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDurationString(departure: string | Date, arrival: string | Date): string {
    const dep = DateTime.fromISO(departure instanceof Date ? departure.toISOString() : departure);
    const arr = DateTime.fromISO(arrival instanceof Date ? arrival.toISOString() : arrival);

    if (!dep.isValid || !arr.isValid) {
        console.error("❌ Error en fechas de duración:", departure, arrival);
        return "-";
    }

    const diff = arr.diff(dep, ["hours", "minutes"]);
    const hours = Math.floor(diff.hours);
    const minutes = Math.round(diff.minutes);

    return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

function convertUTCToLocalTime(utcDate: string | Date, timeZone: string, format = "HH:mm"): string {
    const dt = DateTime.fromISO(utcDate instanceof Date ? utcDate.toISOString() : utcDate, { zone: "utc" });

    if (!dt.isValid) {
        console.error("❌ Fecha inválida:", utcDate);
        return "Fecha inválida";
    }

    return dt.setZone(timeZone).toFormat(format);
}

function convertUTCToLocalDate(utcDate: string | Date, timeZone: string): string {
    const dt = DateTime.fromISO(utcDate instanceof Date ? utcDate.toISOString() : utcDate, { zone: "utc" });

    if (!dt.isValid) {
        console.error("❌ Fecha inválida:", utcDate);
        return "Fecha inválida";
    }

    return dt.setZone(timeZone).toFormat("dd/MM/yyyy");
}

function formatDateTime(value: string | Date | number): string | null {
    const dateTime = DateTime.fromJSDate(typeof value === "string" || typeof value === "number" ? new Date(value) : value);

    if (!dateTime.isValid) return null;

    return dateTime.toFormat("dd/MM/yyyy HH:mm");
}

function formatFullDate(date: string | Date | number, timeZone: string): string | null {
    const browserLocale = "es";

    const dt = DateTime.fromJSDate(typeof date === "string" || typeof date === "number" ? new Date(date) : date)
        .setZone(timeZone)
        .setLocale(browserLocale);

    if (!dt.isValid) {
        console.error("❌ Fecha o zona horaria inválida:", date, timeZone);
        return null;
    }

    return dt.toFormat("cccc, d 'de' LLLL");
}

export function convertUtcToDatetimeLocalInput(utcDate: string | Date, timeZone: string): string {
    const dt = DateTime.fromISO(utcDate instanceof Date ? utcDate.toISOString() : utcDate, { zone: "utc" });

    if (!dt.isValid) {
        console.error("❌ Fecha inválida:", utcDate);
        return "";
    }

    return dt.setZone(timeZone).toFormat("yyyy-MM-dd'T'HH:mm");
}

const fetcher = async <T = unknown>(input: RequestInfo, options?: RequestInit): Promise<T> => {
    const res = await fetch(input, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error al realizar la petición");
    }

    return res.json();
};

import { getSession } from "next-auth/react";

const fetchWithAuth = async <T = unknown>(input: RequestInfo, options: RequestInit = {}): Promise<T> => {
    const session = await getSession();
    const token = session?.backendTokens?.accessToken;

    if (!token) {
        throw new Error("No autenticado");
    }

    const res = await fetch(input, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error en la petición autenticada");
    }

    return res.json();
};

const fetchWithOptionalAuth = async <T = unknown>(input: RequestInfo, options: RequestInit = {}): Promise<T> => {
    const session = await getSession();
    const token = session?.backendTokens?.accessToken;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(input, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error en la petición");
    }

    const text = await res.text();
    if (!text) {
        // Si no hay body, devuelvo null o [] según tu necesidad
        return [] as T;
    }

    return JSON.parse(text);
};

function calculateTotalDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalizamos las horas para evitar errores de zonas horarias
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Calculamos la diferencia en milisegundos y la convertimos a días
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffInMs = end.getTime() - start.getTime();
    const days = Math.max(1, Math.round(diffInMs / msPerDay) + 1); // incluye ambos días

    return days;
}

export {
    formatDateToDDMMYYYY,
    formatDateToYYYYMMDD,
    getDurationString,
    convertUTCToLocalTime,
    convertUTCToLocalDate,
    formatDateTime,
    fetcher,
    fetchWithAuth,
    fetchWithOptionalAuth,
    formatFullDate,
    calculateTotalDays,
};
