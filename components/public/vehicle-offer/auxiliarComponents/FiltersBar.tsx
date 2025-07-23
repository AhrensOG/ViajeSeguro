import { Calendar, Car, Truck, Users } from "lucide-react";

export default function FiltersBar() {
    return (
        <div className="flex items-center justify-start p-4 w-full gap-8 shadow-sm border border-custom-gray-100 pl-[8rem]">
            <div className="flex justify-between items-center gap-4 bg-custom-gray-200 p-2 border border-custom-gray-200 rounded-md">
                <p className={`text-custom-gray-800 flex items-center gap-2 ${true ? "bg-custom-white-100 p-2 px-3 rounded-md" : ""}`}>
                    <span className="h-6 w-6">
                        <Car />
                    </span>{" "}
                    Transporte
                </p>

                <p className={`text-custom-gray-800 flex items-center gap-2 ${false ? "bg-custom-white-100 p-2 px-3 rounded-md" : ""}`}>
                    <span className="h-6 w-6">
                        <Truck />
                    </span>
                    Furgonetas
                </p>
            </div>
            <div className="flex items-center gap-2 p-2">
                <label className="h-6 w-6" htmlFor="origin_date">
                    <Calendar className="text-custom-gray-600" />
                </label>
                <input
                    className="w-full outline-none border border-gray-300 p-2 ring-offset-amber-300 focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                    type="date"
                />
            </div>
            <div className="flex items-center gap-2">
                <label className="h-6 w-6" htmlFor="destination_date">
                    <Calendar className="text-custom-gray-600" />
                </label>
                <input
                    className="w-full outline-none border border-gray-300 p-2 ring-offset-amber-300 focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                    type="date"
                />
            </div>
            <div className="flex items-center gap-2">
                <label className="h-6 w-6" htmlFor="capacity">
                    <Users className="text-custom-gray-600" />
                </label>
                <input
                    className="w-full outline-none border border-gray-300 p-2 ring-offset-amber-300 focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                    type="number"
                    placeholder="Capacidad"
                />
            </div>
            <button className="bg-custom-golden-500 text-custom-white-100 px-4 py-2 rounded-md cursor-pointer hover:bg-custom-golden-700">
                Buscar
            </button>
        </div>
    );
}
