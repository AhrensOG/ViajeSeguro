import { Info } from "lucide-react";

const ReservationInfo = () => (
    <div className="w-full space-y-2">
        {/* Aviso de requisito de conductor */}
        <article className="flex gap-4 w-full items-center justify-center m-1 p-4 border rounded-md border-custom-gray-300 shadow-sm bg-custom-golden-100 text-custom-gray-600">
            <Info className="size-7 text-custom-golden-600" />
            <p>
                El conductor debe contar con más de 8 años de carnet de conducir. Si no cumple este requisito, el propietario del coche
                tiene derecho a rechazar la reserva.
            </p>
        </article>

        {/* Aviso de confirmación de reserva */}
        <article className="flex gap-4 w-full items-center justify-center m-1 p-4 border rounded-md border-custom-gray-300 shadow-sm bg-custom-golden-100 text-custom-gray-600">
            <Info className="size-7 text-custom-golden-600" />
            <p>
                Tu reserva no se confirmará hasta que Viaje Seguro acepte tu solicitud. Recibirás un correo electrónico con la confirmación de tu
                reserva y los detalles de pago.
            </p>
        </article>
    </div>
);

export default ReservationInfo;
