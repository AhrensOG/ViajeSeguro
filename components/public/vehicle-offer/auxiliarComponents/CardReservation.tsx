import { ArrowRight, Fuel, MapPin, Settings, Users } from "lucide-react";
import Image from "next/image";

export default function CardReservation() {
    return (
        <article className=" flex justify-around gap-8 w-full p-8 border border-custom-gray-300 rounded-xl shadow-sm ">
            <div className="flex items-center justify-center w-[20rem] h-[15rem]">
                <Image className="rounded-md w-full h-full" src="/main/img_placeholder.webp" alt="" width={100} height={100} />
            </div>
            <div className=" flex flex-col gap-3 grow-1 justify-evenly">
                <h3 className="text-custom-gray-800 font-bold text-2xl">Mercedes Sprinter 2024</h3>
                <div className="flex gap-3">
                    <p className="flex gap-2 items-center text-lg">
                        <span>
                            <Users className="size-5 text-custom-gray-600" />
                        </span>{" "}
                        9 personas
                    </p>
                    <p className="flex gap-2 items-center text-lg">
                        <span>
                            <Fuel className="size-5 text-custom-gray-600" />
                        </span>{" "}
                        Diesél
                    </p>
                    <p className="flex gap-2 items-center text-lg">
                        <span>
                            <Settings className="size-5 text-custom-gray-600" />
                        </span>
                        {""}
                        Manual
                    </p>
                </div>
                <div className="flex flex-wrap gap-6">
                    <p className="text-sm bg-custom-gray-300 rounded-full p-2">GPS incluido</p>
                    <p className="text-sm bg-custom-gray-300 rounded-full p-2">Aire acondicionado</p>
                    <p className="text-sm bg-custom-gray-300 rounded-full p-2">Bluetooth</p>
                    <p className="text-sm bg-custom-gray-300 rounded-full p-2">Cámara trasera</p>
                </div>
                <p className="flex items-center gap-2 text-lg">
                    <span>
                        <MapPin className="size-5 text-custom-gray-600" />
                    </span>
                    {""}
                    Local Valencia Centro
                </p>
            </div>
            <div className="flex flex-col gap-2 w-[20rem] items-end justify-evenly">
                <p className="text-custom-gray-600 text-xl">2025-07-12 - 2025-07-15</p>
                <p className="text-custom-gray-700 text-4xl font-bold">255€</p>
                <p className="text-custom-black-700 text-lg">85€/dia x 3 dias</p>
                <button className="py-4 w-[12rem] bg-custom-golden-600 text-custom-white-100 rounded-md text-xl flex gap-3 items-center justify-center cursor-pointer hover:bg-custom-golden-700">
                    Reservar
                    <span>
                        <ArrowRight className="size-5" />
                    </span>
                </button>
                <p className="text-custom-black-700 text-lg">Canselacion gratuita</p>
            </div>
        </article>
    );
}
