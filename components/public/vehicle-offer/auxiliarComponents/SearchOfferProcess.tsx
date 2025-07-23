import FiltersBar from "./FiltersBar";
import CardInformationLeft from "./CardInformationLeft";
import CardReservation from "./CardReservation";
export default function SearchOfferProcess() {
    return (
        <div className="grow-1 flex flex-col bg-custom-white-100 relative">
            <FiltersBar />
            <div className="flex justify-between gap-8 m-[5rem] mt-[2rem]">
                <CardInformationLeft />
                <section className="flex flex-col items-start justify-start gap-4 w-full grow-1">
                    <div className="flex flex-col gap-2 w-full">
                        <h1 className="text-custom-gray-800 text-4xl font-bold">Furgonetas disponibles en Valencia</h1>
                        <p className="text-custom-gray-600 text-lg">Encontramos 3 furgonetas para tus fechas</p>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <CardReservation />
                        <CardReservation />
                        <CardReservation />
                        <CardReservation />
                        <CardReservation />
                    </div>
                </section>
            </div>
        </div>
    );
}
