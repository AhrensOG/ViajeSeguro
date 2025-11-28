"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { listRiderRequests, getDriverAssignedRequests, getDriverBids, createDriverBid, MyRiderRequestItem, DriverBid } from "@/lib/api/rider-requests";
import { getUserVehicles } from "@/lib/api/partner/vehicles";
import { toast } from "sonner";
import { convertUTCToLocalDate, convertUTCToLocalTime } from "@/lib/functions";
import Link from "next/link";
import type { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";

export default function PartnerRiderRequestsPage() {
  useSession();
  const [tab, setTab] = useState<"nuevos" | "mis" | "postulaciones">("nuevos");
  const [loading, setLoading] = useState(false);
  const [openRequests, setOpenRequests] = useState<MyRiderRequestItem[]>([]);
  const [assigned, setAssigned] = useState<MyRiderRequestItem[]>([]);
  const [bids, setBids] = useState<DriverBid[]>([]);
  const [approvedVehicles, setApprovedVehicles] = useState<Vehicle[]>([]);
  const [bidTarget, setBidTarget] = useState<MyRiderRequestItem | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const bidByRequest = useMemo(() => {
    const map: Record<string, DriverBid> = {};
    for (const b of bids) {
      map[b.requestId] = b;
    }
    return map;
  }, [bids]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const [openList, assignedList, bidList, myVehicles] = await Promise.all([
        listRiderRequests({ status: "OPEN", dateFrom: from }),
        getDriverAssignedRequests(),
        getDriverBids(),
        getUserVehicles(),
      ]);
      setOpenRequests(Array.isArray(openList) ? openList : []);
      setAssigned(Array.isArray(assignedList) ? assignedList : []);
      const sortedBids = Array.isArray(bidList) ? bidList.sort((a, b) => {
        const priority = { ACCEPTED: 0, PENDING: 1, REJECTED: 2 };
        return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
      }) : [];
      setBids(sortedBids);
      const approved = (myVehicles || []).filter((v: Vehicle) => v.approvalStatus === "APPROVED" && !(v as Vehicle & { isDeleted?: boolean }).isDeleted);
      setApprovedVehicles(approved);
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "No se pudieron cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Reload when tab changes so status/badges stay up-to-date
  useEffect(() => {
    loadAll();
  }, [tab]);

  // Reload when window gains focus or tab becomes visible
  useEffect(() => {
    const onFocus = () => loadAll();
    const onVisibility = () => { if (document.visibilityState === 'visible') loadAll(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const canBid = approvedVehicles.length > 0;

  const openBidModal = (req: MyRiderRequestItem) => {
    if (!canBid) {
      toast.info("Para postularte necesitás tener al menos un vehículo aprobado por administración.");
      return;
    }
    setBidTarget(req);
    setSelectedVehicleId(approvedVehicles[0]?.id || "");
  };

  const closeBidModal = () => {
    setBidTarget(null);
    setSelectedVehicleId("");
  };

  const confirmBid = async () => {
    if (!bidTarget || !selectedVehicleId) return;
    try {
      setSubmitting(true);
      await createDriverBid(bidTarget.id, { vehicleId: selectedVehicleId });
      toast.success("Postulación enviada");
      closeBidModal();
      await loadAll();
    } catch (e: unknown) {
      toast.error((e as Error)?.message || "No se pudo postular");
    } finally {
      setSubmitting(false);
    }
  };

  const SectionCard = ({ req, bidStatus }: { req: MyRiderRequestItem; bidStatus?: "PENDING" | "ACCEPTED" | "REJECTED" }) => {
    const date = convertUTCToLocalDate(req.departureAt, tz);
    const time = convertUTCToLocalTime(req.departureAt, tz);
    const joinedCount = Array.isArray(req.passengers) ? req.passengers.filter((p) => p.status === "JOINED").length : undefined;
    const available = typeof joinedCount === "number" ? Math.max(req.maxPassengers - joinedCount, 0) : undefined;
    const hasDriver = Boolean(req.chosenBid);
    const statusLabel = bidStatus === "ACCEPTED" ? "Aceptado" : bidStatus === "REJECTED" ? "Rechazado" : bidStatus === "PENDING" ? "Pendiente" : undefined;
    const statusClasses = bidStatus === "ACCEPTED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : bidStatus === "REJECTED"
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : bidStatus === "PENDING"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "";
    return (
      <div className="group rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden">
        <div className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wide text-blue-700 font-semibold">Armar tu viaje</div>
              <div className="mt-0.5 text-base md:text-lg text-slate-900 font-semibold flex items-center gap-2">
                <span className="truncate max-w-[240px] md:max-w-[360px]">{req.origin}</span>
                <span className="opacity-50">→</span>
                <span className="truncate max-w-[240px] md:max-w-[360px]">{req.destination}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{date} • {time}</div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700">
                  <span className="font-semibold">Postulados: </span>
                  <span>{typeof joinedCount === "number" ? joinedCount : "—"}</span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700">
                  <span className="font-semibold">Capacidad: </span>
                  <span>{req.maxPassengers}</span>
                  {typeof available === "number" && <span className="ml-1 text-slate-500">({available} disp.)</span>}
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700">
                  <span className="font-semibold">Conductor: </span>
                  <span>{hasDriver ? "Asignado" : "Sin asignar"}</span>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end gap-2 md:min-w-[220px]">
              {statusLabel && (
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses}`}>
                  {statusLabel}
                </span>
              )}
              <div className="flex items-center gap-2">
                <Link href={`/rider-request?id=${req.id}`} className="px-3 py-2 rounded-md border border-slate-300 text-sm hover:bg-slate-50">Ver detalle</Link>
                {!bidStatus && (
                  <button
                    onClick={() => openBidModal(req)}
                    disabled={!canBid}
                    className={`px-3 py-2 rounded-md text-sm text-white ${canBid ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-400 cursor-not-allowed"}`}
                  >
                    Postularme
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Arma tu viaje</h1>

      {!canBid && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 text-sm">
          Para postularte como conductor, primero debes subir un coche y esperar su aprobación.
          <Link href="/dashboard/partner/vehicles" className="ml-2 underline">Ir a Mis vehículos</Link>
        </div>
      )}

      {/* Banner de Aprobación */}
      {bids.some(b => b.status === 'ACCEPTED') && (
        <div className="mb-6 p-4 bg-emerald-600 rounded-lg shadow-md text-white flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">¡Felicitaciones!</h3>
              <p className="text-emerald-50 text-sm">
                Tienes {bids.filter(b => b.status === 'ACCEPTED').length} postulación(es) aprobada(s). ¡Prepárate para tu viaje!
              </p>
            </div>
          </div>
          <button onClick={() => setTab("postulaciones")} className="px-4 py-2 bg-white text-emerald-700 font-semibold rounded-md shadow-sm hover:bg-emerald-50 transition-colors text-sm">
            Ver aprobados
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("nuevos")} className={`px-3 py-2 rounded-md text-sm ${tab === "nuevos" ? "bg-custom-golden-600 text-white" : "bg-custom-gray-200"}`}>Nuevos</button>
        <button onClick={() => setTab("mis")} className={`px-3 py-2 rounded-md text-sm ${tab === "mis" ? "bg-custom-golden-600 text-white" : "bg-custom-gray-200"}`}>Mis viajes</button>
        <button onClick={() => setTab("postulaciones")} className={`px-3 py-2 rounded-md text-sm ${tab === "postulaciones" ? "bg-custom-golden-600 text-white" : "bg-custom-gray-200"}`}>Mis postulaciones</button>
        <div className="flex-1" />
        <button onClick={loadAll} className="px-3 py-2 rounded-md text-sm border border-slate-300 hover:bg-slate-50">Refrescar</button>
      </div>

      {loading && <div className="text-sm text-custom-gray-700">Cargando...</div>}

      {!loading && tab === "nuevos" && (
        <div className="space-y-3">
          {openRequests.length === 0 && <div className="text-sm text-custom-gray-600">No hay solicitudes recientes.</div>}
          {openRequests.map((r) => (
            <SectionCard key={r.id} req={r} bidStatus={bidByRequest[r.id]?.status} />
          ))}
        </div>
      )}

      {!loading && tab === "mis" && (
        <div className="space-y-3">
          {assigned.length === 0 && <div className="text-sm text-custom-gray-600">Aún no tienes viajes asignados.</div>}
          {assigned.map((r) => (
            <SectionCard key={r.id} req={r} bidStatus="ACCEPTED" />
          ))}
        </div>
      )}

      {!loading && tab === "postulaciones" && (
        <div className="space-y-3">
          {bids.length === 0 && <div className="text-sm text-custom-gray-600">Aún no realizaste postulaciones.</div>}
          {bids.map((b) => {
            const img = b.vehicle?.images && b.vehicle.images[0]?.url;
            const vm = `${b.vehicle?.brand ?? ''} ${b.vehicle?.model ?? ''}`.trim();
            const plate = b.vehicle?.plate || '—';
            const organizer = `${(b.request as MyRiderRequestItem & { creator?: { name: string; lastName: string } })?.creator?.name ?? ''} ${(b.request as MyRiderRequestItem & { creator?: { name: string; lastName: string } })?.creator?.lastName ?? ''}`.trim();
            const isAccepted = b.status === 'ACCEPTED';
            return (
              <div key={b.id} className={`relative rounded-xl border shadow-sm overflow-hidden bg-white px-4 py-3 md:px-5 transition-all ${isAccepted ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-emerald-100' : 'border-slate-200'}`}>
                {/* Ribbon for assigned */}
                {isAccepted && (
                  <div className="absolute -right-12 top-3 rotate-45 bg-emerald-600 text-white text-[11px] font-semibold px-12 py-1 shadow-sm z-10">
                    APROBADO
                  </div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {img ? (
                      <div className="relative w-16 h-12 rounded-md overflow-hidden border border-slate-200">
                        <Image src={img} alt="Vehículo" fill className="object-cover object-center" />
                      </div>
                    ) : (
                      <div className="w-16 h-12 rounded-md border border-dashed border-slate-200 bg-white" />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">{vm || 'Vehículo'}</div>
                      <div className="text-xs text-slate-600">Matrícula: {plate}</div>
                      {b.request && (
                        <div className="mt-1 text-xs text-slate-700 flex items-center gap-2">
                          <span className="truncate max-w-[160px] md:max-w-[260px]">{b.request.origin}</span>
                          <span className="opacity-50">→</span>
                          <span className="truncate max-w-[160px] md:max-w-[260px]">{b.request.destination}</span>
                        </div>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="text-slate-600">Organizador: {organizer || '—'}</span>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-semibold ${isAccepted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : b.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          {isAccepted ? '¡Aprobado!' : b.status === 'PENDING' ? 'Pendiente' : 'Rechazado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {b.request && (
                    <Link href={`/rider-request?id=${b.requestId}`} className={`px-3 py-2 rounded-md border text-sm transition-colors ${isAccepted ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' : 'border-slate-300 hover:bg-slate-50'}`}>
                      {isAccepted ? 'Ver viaje' : 'Ver detalle'}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {bidTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeBidModal} />
          <div className="relative bg-white w-full max-w-md mx-auto rounded-lg shadow-lg border border-custom-gray-300 p-6">
            <h3 className="text-lg font-semibold text-custom-black-900 mb-2">Postularme como conductor</h3>
            <p className="text-sm text-custom-gray-800 mb-3">Selecciona el vehículo con el que deseas postularte.</p>
            <select value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)} className="w-full border rounded-md px-3 py-2 mb-4">
              {approvedVehicles.map((v) => (
                <option key={v.id} value={v.id}>{`${v.brand} ${v.model} · ${v.plate}`}</option>
              ))}
            </select>
            <div className="flex items-center justify-end gap-2">
              <button onClick={closeBidModal} className="px-3 py-2 text-sm rounded-md border border-custom-gray-300 text-custom-gray-800">Cancelar</button>
              <button onClick={confirmBid} disabled={submitting || !selectedVehicleId} className="px-3 py-2 text-sm rounded-md bg-custom-golden-600 hover:bg-custom-golden-700 text-white disabled:opacity-60">
                {submitting ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
