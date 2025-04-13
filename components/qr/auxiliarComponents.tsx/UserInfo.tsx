"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { User } from "lucide-react";
import Image from "next/image";

type Props = {
  reservation: ReservationResponse;
};

const UserInfo = ({ reservation }: Props) => {
  const { user } = reservation;

  return (
    <section className="text-sm bg-custom-gray-100 p-4 rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        {user.avatarUrl && (
          <Image
            src={user.avatarUrl}
            alt="Avatar del usuario"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        )}
        <div className="flex flex-col text-custom-gray-700">
          <span className="font-medium flex items-center gap-2">
            <User className="size-4" />
            {user.name} {user.lastName}
          </span>
          <span className="text-xs text-custom-gray-500">
            ID usuario: {user.id.slice(-6)} · {user.email}
          </span>
          {!user.emailVerified && (
            <span className="text-xs text-red-500 mt-1">
              ✖ Email no verificado
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-custom-gray-500">
        Verifica visualmente que esta persona coincide con el pasajero presente.
      </p>
    </section>
  );
};

export default UserInfo;
