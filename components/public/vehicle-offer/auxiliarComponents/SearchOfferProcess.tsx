"use client";

import FiltersBar from "./FiltersBar";
import CardInformationLeft from "./CardInformationLeft";
import CardReservation from "./CardReservation";

export default function SearchOfferProcess() {
    return (
        <div className="grow flex flex-col bg-custom-white-100 relative px-4 lg:px-20 py-10">
            {/* Contenedor principal responsive */}
            <div className="flex flex-col lg:flex-row justify-between lg:justify-center gap-8">
                {/* Columna izquierda con info del alquiler */}
                <div className="w-full lg:w-[40%] xl:w-[25rem] hidden lg:block">
                    <CardInformationLeft />
                </div>

                {/* Columna derecha con resultados */}
                <section className="flex flex-col items-start gap-4 w-full lg:w-[60%] xl:w-[60rem]">
                    <div className="flex flex-col gap-2 w-full">
                        <h1 className="text-custom-gray-800 text-2xl xl:text-4xl font-bold">Furgonetas disponibles en Valencia</h1>
                        <p className="text-custom-gray-600 text-md lg:text-lg">Encontramos 3 furgonetas para tus fechas</p>
                    </div>
                    <div className="w-full mx-auto px-4 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <CardReservation key={i} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
