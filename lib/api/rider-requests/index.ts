import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth, fetchWithOptionalAuth } from "@/lib/functions";

export type CreateRiderRequestPayload = {
  origin: string;
  originLocation: string;
  destination: string;
  destinationLocation: string;
  departureAt: string;
  seatsRequested: number;
  maxPassengers: number;
  ivaRate?: number;
};

export async function createRiderRequest(data: CreateRiderRequestPayload) {
  const res = await fetchWithAuth(`${BACKEND_URL}/rider-requests`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res;
}

export type SearchRiderRequestQuery = {
  origin: string;
  destination: string;
  departure?: string; // ISO date or datetime
  dateFrom?: string;
  dateTo?: string;
};

export async function searchRiderRequests(query: SearchRiderRequestQuery) {
  const params = new URLSearchParams({ status: "OPEN,MATCHED" });

  if (query.dateFrom && query.dateTo) {
    params.set("dateFrom", query.dateFrom);
    params.set("dateTo", query.dateTo);
  } else if (query.departure) {
    const d = new Date(query.departure);
    const dateFrom = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0)).toISOString();
    const dateTo = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59)).toISOString();
    params.set("dateFrom", dateFrom);
    params.set("dateTo", dateTo);
  }

  if (query.origin) params.set("origin", query.origin);
  if (query.destination) params.set("destination", query.destination);
  const res = await fetchWithOptionalAuth(`${BACKEND_URL}/rider-requests?${params.toString()}`);
  return res;
}

export type RiderRequestDetail = {
  userId: string;
  id: string;
  origin: string;
  originLocation: string;
  destination: string;
  destinationLocation: string;
  departureAt: string;
  seatsRequested: number;
  maxPassengers: number;
  finalPrice?: number;
  user?: {
    id: string;
    name?: string;
    lastName?: string;
    driverVerified?: boolean;
    avatarUrl?: string;
  } | null;
  capacity?: number;
  passengerCount?: number;
  passengers?: Array<{
    userId: string;
    isOwner: boolean;
    status: string;
  }>;
  bids?: Array<{
    id: string;
    driverId: string;
    vehicleId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    message?: string;
    vehicle?: {
      id: string;
      plate?: string;
      brand?: string;
      model?: string;
      images?: Array<{ url: string }>;
    } | null;
    driver?: {
      id: string;
      name?: string;
      lastName?: string;
      avatarUrl?: string;
    } | null;
  }>;
  chosenBid?: {
    id: string;
    driverId: string;
    vehicleId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    message?: string;
    vehicle?: {
      id: string;
      plate?: string;
      brand?: string;
      model?: string;
      images?: Array<{ url: string }>;
    } | null;
    driver?: {
      id: string;
      name?: string;
      lastName?: string;
      avatarUrl?: string;
    } | null;
  } | null;
};

export async function getRiderRequestById(id: string) {
  return fetchWithOptionalAuth<RiderRequestDetail>(`${BACKEND_URL}/rider-requests/${id}`);
}

export type MyRiderRequestItem = {
  id: string;
  origin: string;
  originLocation: string;
  destination: string;
  destinationLocation: string;
  departureAt: string;
  seatsRequested: number;
  maxPassengers: number;
  finalPrice?: number;
  status?: string;
  passengers?: Array<{ status: string }>;
  chosenBid?: unknown;
  user?: {
    id: string;
    name?: string;
    lastName?: string;
    avatarUrl?: string;
  } | null;
};

export async function getMyRiderRequests() {
  return fetchWithAuth<MyRiderRequestItem[]>(`${BACKEND_URL}/rider-requests/mine`);
}

export async function joinRiderRequest(id: string) {
  return fetchWithAuth(`${BACKEND_URL}/rider-requests/${id}/join`, {
    method: "POST",
  });
}

export async function leaveRiderRequest(id: string) {
  return fetchWithAuth(`${BACKEND_URL}/rider-requests/${id}/leave`, {
    method: "POST",
  });
}

export async function getJoinedRiderRequests() {
  return fetchWithAuth<MyRiderRequestItem[]>(`${BACKEND_URL}/rider-requests/joined`);
}

export async function listRiderRequests(params: { status?: string; dateFrom?: string; dateTo?: string }) {
  const qp = new URLSearchParams();
  if (params.status) qp.set("status", params.status);
  if (params.dateFrom) qp.set("dateFrom", params.dateFrom);
  if (params.dateTo) qp.set("dateTo", params.dateTo);
  return fetchWithOptionalAuth<MyRiderRequestItem[]>(`${BACKEND_URL}/rider-requests?${qp.toString()}`);
}

export type DriverBid = {
  id: string;
  requestId: string;
  driverId?: string;
  vehicleId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  message?: string;
  request?: MyRiderRequestItem;
  vehicle?: {
    id: string;
    plate?: string;
    brand?: string;
    model?: string;
    images?: Array<{ url: string }>;
  } | null;
  driver?: {
    id: string;
    name?: string;
    lastName?: string;
    avatarUrl?: string;
  } | null;
};

export async function getDriverBids() {
  return fetchWithAuth<DriverBid[]>(`${BACKEND_URL}/rider-requests/driver/bids`);
}

export async function getDriverAssignedRequests() {
  return fetchWithAuth<MyRiderRequestItem[]>(`${BACKEND_URL}/rider-requests/driver/assigned`);
}

export async function createDriverBid(requestId: string, data: { vehicleId: string; message?: string }) {
  return fetchWithAuth(`${BACKEND_URL}/rider-requests/${requestId}/bids`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function selectDriverBid(requestId: string, bidId: string) {
  return fetchWithAuth(`${BACKEND_URL}/rider-requests/${requestId}/select-bid/${bidId}`, {
    method: "PATCH",
  });
}
