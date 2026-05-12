"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { User, Users, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

type Props = {
    reservation:
        | ReservationResponse
        | { user: { id: string; name: string; lastName: string; email: string; emailVerified: boolean; avatarUrl?: string; createdAt: Date }; passengers?: string[] };
};

const UserInfo = ({ reservation }: Props) => {
    const { user } = reservation;
    const passengers = (reservation as ReservationResponse).passengers ?? [];
    const totalPassengers = 1 + passengers.length;

    return (
        <section className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2 text-blue-700">
                    <Users className="size-4" />
                    <span className="font-semibold text-sm">Pasajero(s)</span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                        <Image src={user.avatarUrl} alt="Avatar" width={48} height={48} className="rounded-full object-cover ring-2 ring-gray-100" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center ring-2 ring-amber-50">
                            <User className="size-5 text-amber-600" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                            {user.name} {user.lastName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-gray-500 truncate">{user.email}</span>
                            {user.emailVerified ? (
                                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                            ) : (
                                <XCircle className="size-3.5 text-red-400 shrink-0" />
                            )}
                        </div>
                    </div>
                </div>

                {passengers.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Acompañantes ({passengers.length})
                        </p>
                        <ul className="space-y-1.5">
                            {passengers.map((name, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-medium text-gray-600">{idx + 1}</span>
                                    </div>
                                    {name || `Acompañante ${idx + 1}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                    <Users className="size-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">
                        <strong>{totalPassengers}</strong> {totalPassengers === 1 ? "pasajero" : "pasajeros"} en total
                        {passengers.length > 0 && <span className="font-normal text-amber-700"> (titular + {passengers.length} acompañante{passengers.length > 1 ? "s" : ""})</span>}
                    </span>
                </div>

                <p className="text-xs text-gray-400 text-center">
                    Verifica que esta persona coincide con el pasajero presente
                </p>
            </div>
        </section>
    );
};

export default UserInfo;
