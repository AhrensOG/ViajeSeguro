import { Calendar, MapPin, Truck } from "lucide-react";

const ReservationDetails = () => (
    <article className="flex gap-4 w-full h-[14rem] m-1 p-6 border rounded-md border-custom-gray-300 shadow-sm flex-wrap">
        <h3 className="text-custom-gray-800 font-bold text-2xl w-full">Detalles de tu Reserva</h3>
        {[Calendar, Calendar, MapPin, Truck].map((Icon, index) => (
            <div key={index} className="flex gap-2 items-center w-[45%]">
                <Icon className="size-6 text-custom-golden-600" />
                <p className="text-custom-gray-600 text-lg flex flex-col">
                    <span>Recodiga:</span>2025-07-12
                </p>
            </div>
        ))}
    </article>
);

export default ReservationDetails;
