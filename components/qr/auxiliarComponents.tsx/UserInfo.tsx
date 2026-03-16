"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { User, Users } from "lucide-react";
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
        <section className="text-sm bg-custom-gray-100 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
                {user.avatarUrl && (
                    <Image src={user.avatarUrl} alt="Avatar del usuario" width={40} height={40} className="rounded-full object-cover" />
                )}
                <div className="flex flex-col text-custom-gray-700">
                    <span className="font-medium flex items-center gap-2">
                        <User className="size-4" />
                        {user.name} {user.lastName}
                        <span className="text-xs text-custom-gray-500">(titular)</span>
                    </span>
                    <span className="text-xs text-custom-gray-500">
                        ID usuario: {user.id.slice(-6)} · {user.email}
                    </span>
                    {!user.emailVerified && <span className="text-xs text-red-500 mt-1">✖ Email no verificado</span>}
                </div>
            </div>

            {/* Companion passengers */}
            {passengers.length > 0 && (
                <div className="border-t border-custom-gray-300 pt-3">
                    <p className="text-xs font-semibold text-custom-gray-700 flex items-center gap-1 mb-2">
                        <Users className="size-3.5" />
                        Acompañantes:
                    </p>
                    <ul className="space-y-1">
                        {passengers.map((name, idx) => (
                            <li key={idx} className="text-sm text-custom-gray-700 flex items-center gap-2">
                                <User className="size-3 text-custom-gray-400" />
                                {name || `Acompañante ${idx + 1}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Total passengers badge */}
            <div className="flex items-center gap-2 bg-custom-golden-50 border border-custom-golden-200 rounded-md px-3 py-2">
                <Users className="size-4 text-custom-golden-700" />
                <span className="text-sm font-semibold text-custom-golden-800">
                    Total: {totalPassengers} {totalPassengers === 1 ? "pasajero" : "pasajeros"}
                </span>
            </div>

            <p className="text-xs text-custom-gray-500">Verifica visualmente que esta persona coincide con el pasajero presente.</p>
        </section>
    );
};

export default UserInfo;
