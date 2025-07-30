import { convertUTCToLocalDate } from "@/lib/functions";
import { Calendar, MapPin, Truck } from "lucide-react";
interface ReservationDetailsProps {
    serviceType: string;
    withdrawLocation: string;
    dateStart: string;
    dateEnd: string;
    originalTimeZone: string;
}
export default function ReservationDetails(props: ReservationDetailsProps) {
    const { serviceType, withdrawLocation, dateStart, dateEnd, originalTimeZone } = props;
    return (
        <article className="flex gap-4 w-full h-[14rem] m-1 p-6 border rounded-md border-custom-gray-300 shadow-sm flex-wrap">
            <h3 className="text-custom-gray-800 font-bold text-2xl w-full">Detalles de tu Reserva</h3>

            <div className="flex gap-2 items-center w-[45%]">
                <Calendar className="size-6 text-custom-golden-600" />
                <p className="text-custom-gray-600 text-lg flex flex-col">
                    <span>Recodiga:</span>
                    {convertUTCToLocalDate(dateStart, originalTimeZone)}
                </p>
            </div>
            <div className="flex gap-2 items-center w-[45%]">
                <Calendar className="size-6 text-custom-golden-600" />
                <p className="text-custom-gray-600 text-lg flex flex-col">
                    <span>Recodiga:</span> {convertUTCToLocalDate(dateEnd, originalTimeZone)}
                </p>
            </div>
            <div className="flex gap-2 items-center w-[45%]">
                <MapPin className="size-6 text-custom-golden-600" />
                <p className="text-custom-gray-600 text-lg flex flex-col">
                    <span>Ubicacion:</span>
                    {withdrawLocation}
                </p>
            </div>
            <div className="flex gap-2 items-center w-[45%]">
                <Truck className="size-6 text-custom-golden-600" />
                <p className="text-custom-gray-600 text-lg flex flex-col">
                    <span>Tipo de servicio:</span>
                    {serviceType === "WITH_DRIVER" ? "Con conductor" : "Sin conductor"}
                </p>
            </div>
        </article>
    );
}
