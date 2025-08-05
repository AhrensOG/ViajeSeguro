import { Info } from "lucide-react";

const ReservationInfo = () => (
    <article className="flex gap-4 w-full items-center justify-center m-1 p-4 border rounded-md border-custom-gray-300 shadow-sm bg-custom-golden-100 text-custom-gray-600">
        <Info className="size-7 text-custom-golden-600" />
        <p>
            Tu reserva no se confirmara hasta que Viaje Seguro acepte tu solicitud. Recibirás un correo electrónico con la confirmación de tu reserva
            y los detalles de pago.
        </p>
    </article>
);

export default ReservationInfo;
