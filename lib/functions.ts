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
}

function formatDateToYYYYMMDD(date: Date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDurationString(
  departure: string | Date,
  arrival: string | Date
): string {
  const dep = DateTime.fromISO(
    departure instanceof Date ? departure.toISOString() : departure
  );
  const arr = DateTime.fromISO(
    arrival instanceof Date ? arrival.toISOString() : arrival
  );

  if (!dep.isValid || !arr.isValid) {
    console.error("❌ Error en fechas de duración:", departure, arrival);
    return "-";
  }

  const diff = arr.diff(dep, ["hours", "minutes"]);
  const hours = Math.floor(diff.hours);
  const minutes = Math.round(diff.minutes);

  return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

function convertUTCToLocalTime(
  utcDate: string | Date,
  timeZone: string,
  format = "HH:mm"
): string {
  const dt = DateTime.fromISO(
    utcDate instanceof Date ? utcDate.toISOString() : utcDate,
    { zone: "utc" }
  );

  if (!dt.isValid) {
    console.error("❌ Fecha inválida:", utcDate);
    return "Fecha inválida";
  }

  return dt.setZone(timeZone).toFormat(format);
}

function convertUTCToLocalDate(
  utcDate: string | Date,
  timeZone: string
): string {
  const dt = DateTime.fromISO(
    utcDate instanceof Date ? utcDate.toISOString() : utcDate,
    { zone: "utc" }
  );

  if (!dt.isValid) {
    console.error("❌ Fecha inválida:", utcDate);
    return "Fecha inválida";
  }

  return dt.setZone(timeZone).toFormat("dd/MM/yyyy");
}

export const fetcher = async <T = any>(
  input: RequestInfo,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(input, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Error al realizar la petición');
  }

  return res.json();
};

export { formatDateToDDMMYYYY, formatDateToYYYYMMDD, getDurationString, convertUTCToLocalTime, convertUTCToLocalDate }