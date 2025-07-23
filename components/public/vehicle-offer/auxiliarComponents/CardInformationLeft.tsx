import { CalendarDays, Car, MapPin, Users } from "lucide-react";
import Image from "next/image";

export default function CardInformationLeft() {
    return (
        <section className="flex flex-col items-center justify-between gap-5 w-[40rem] h-[45rem] rounded-md mt-5 sticky top-[100px] ">
            <div className="flex flex-col items-center justify-center h-[27rem] w-full rounded-md shadow-md">
                <Image className="rounded-md" src="/main/img_placeholder.webp" alt="" width={900} height={900} />
            </div>
            <div className="flex flex-col items-start justify-start gap-2 p-4 w-full border rounded-md border-custom-gray-300">
                <h3 className="text-custom-gray-800 font-bold">Información del alquiler</h3>
                <p className="flex gap-2 p-2 items-center">
                    <span>
                        <MapPin className="size-4 text-custom-gray-500" />
                    </span>{" "}
                    Recogida: Local Valencia Centro
                </p>
                <p className="flex gap-2 p-2 items-center">
                    <span>
                        <CalendarDays className="size-4 text-custom-gray-500" />
                    </span>{" "}
                    Duración: 3 dias.
                </p>
                <p className="flex gap-2 p-2 items-center">
                    <span>
                        <Car className="size-4 text-custom-gray-500" />
                    </span>{" "}
                    Tipo: Sin conductor
                </p>
                <p className="flex gap-2 p-2 items-center">
                    <span>
                        <Users className="size-4 text-custom-gray-500" />
                    </span>{" "}
                    Hasta 6 personas
                </p>
            </div>
        </section>
    );
}
