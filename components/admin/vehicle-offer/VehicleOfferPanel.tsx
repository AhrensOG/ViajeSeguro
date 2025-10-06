"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import SkeletonTable from "../SkeletonTable";
import CreateVehicleOfferModal from "./auxiliarComponents/CreateVehicleOfferModal";
import EditVehicleOfferModal from "./auxiliarComponents/EditVehicleOfferModal";
import VehicleOfferDetailsModal from "./auxiliarComponents/VehicleOfferDetailsModal";
import { deleteVehicleOffer, fetchSimpleUsers, fetchSimpleVehicles, fetchVehicleOffers } from "@/lib/api/admin/vehicle-offers";
import { SimpleUser, SimpleVehicle, VehicleOffersAdminResponse } from "@/lib/api/admin/vehicle-offers/vehicleOffers.types";
import { calculateTotalDays } from "@/lib/functions";
import { toast } from "sonner";
import DeleteToast from "../DeleteToast";

const vehicleOfferTypeMap = {
    WITH_DRIVER: "Con conductor",
    WITHOUT_DRIVER: "Sin conductor",
} as const;

export default function VehicleOfferPanel() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [offers, setOffers] = useState<VehicleOffersAdminResponse[]>([]);
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [vehicles, setVehicles] = useState<SimpleVehicle[]>([]);
    const [selectedOffer, setSelectedOffer] = useState<VehicleOffersAdminResponse | null>(null);

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [filters, setFilters] = useState({
        owner: "",
        capacity: "",
        availableFrom: "",
        availableTo: "",
        type: "",
        price: "",
        fuel: "",
        transmission: "",
    });

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const offers = await fetchVehicleOffers();
                const users = await fetchSimpleUsers();
                const vehicles = await fetchSimpleVehicles();
                setOffers(offers as VehicleOffersAdminResponse[]);
                setUsers(users as SimpleUser[]);
                setVehicles(vehicles as SimpleVehicle[]);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    const filtered = offers.filter((offer) => {
        return (
            `${offer.withdrawLocation} ${offer.returnLocation} ${offer.owner.name} ${offer.owner.lastName}`
                .toLowerCase()
                .includes(search.toLowerCase()) &&
            (filters.owner ? offer.owner.id === filters.owner : true) &&
            (filters.capacity ? offer.vehicle.capacity === Number(filters.capacity) : true) &&
            (filters.availableFrom ? new Date(offer.availableFrom) >= new Date(filters.availableFrom) : true) &&
            (filters.availableTo ? new Date(offer.availableTo) <= new Date(filters.availableTo) : true) &&
            (filters.type ? offer.vehicleOfferType === filters.type : true) &&
            (filters.price ? offer.pricePerDay <= Number(filters.price) : true) &&
            (filters.fuel ? offer.vehicle.fuelType === filters.fuel : true) &&
            (filters.transmission ? offer.vehicle.transmissionType === filters.transmission : true)
        );
    });

    const clearFilters = () => {
        setSearch("");
        setFilters({
            owner: "",
            capacity: "",
            availableFrom: "",
            availableTo: "",
            type: "",
            price: "",
            fuel: "",
            transmission: "",
        });
    };

    const handleDelete = async (offerId: string) => {
        try {
            await deleteVehicleOffer(offerId);
            setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== selectedOffer?.id));
            setSelectedOffer(null);
            toast.success("Oferta eliminada exitosamente");
        } catch {
            toast.info("Ocurrio un problema al eliminar la oferta, intente de nuevo");
        }
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold text-custom-golden-600">Panel de Ofertas de Vehículos</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="cursor-pointer flex items-center gap-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Nueva oferta
                </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-custom-white-100 p-4 border border-custom-gray-300 rounded-md mb-4">
                <div className="relative col-span-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por ciudad u propietario"
                        className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pl-10"
                    />
                    <Search className="absolute top-2.5 left-2.5 h-5 w-5 text-custom-gray-400" />
                </div>
                <input
                    type="number"
                    placeholder="Capacidad"
                    value={filters.capacity}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, capacity: e.target.value }))}
                />
                <input
                    type="date"
                    value={filters.availableFrom}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, availableFrom: e.target.value }))}
                />
                <input
                    type="date"
                    value={filters.availableTo}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, availableTo: e.target.value }))}
                />
                <input
                    type="number"
                    placeholder="Precio máximo"
                    value={filters.price}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, price: e.target.value }))}
                />
                <select
                    value={filters.type}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                >
                    <option value="">Todos los tipos</option>
                    <option value="WITH_DRIVER">Con conductor</option>
                    <option value="WITHOUT_DRIVER">Sin conductor</option>
                </select>
                <select
                    value={filters.fuel}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, fuel: e.target.value }))}
                >
                    <option value="">Combustible</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="GASOLINE">Gasolina</option>
                    <option value="ELECTRIC">Eléctrico</option>
                </select>
                <select
                    value={filters.transmission}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, transmission: e.target.value }))}
                >
                    <option value="">Transmisión</option>
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATIC">Automática</option>
                    <option value="SEMI_AUTOMATIC">Semi Automática</option>
                </select>
                <button
                    onClick={clearFilters}
                    className="cursor-pointer col-span-2 md:col-span-1 bg-custom-gray-300 hover:bg-custom-gray-400 text-black px-4 py-2 rounded-md shadow-sm"
                >
                    Limpiar filtros
                </button>
            </div>

            {loading ? (
                <SkeletonTable rows={5} />
            ) : (
                <div className="flex-1 w-full bg-custom-white-100 rounded-xl shadow-sm border border-custom-gray-200 overflow-auto">
                    <table className="min-w-full text-sm text-left table-fixed border-separate border-spacing-0">
                        <thead className="bg-custom-golden-100 text-custom-golden-700 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Retiro</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Devolucion</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Disponibilidad</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Precio por día</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Capacidad</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Tipo</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Marca</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Matrícula</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="text-custom-black-800">
                            {filtered.map((offer, index) => (
                                <tr
                                    key={offer.id}
                                    className={`${
                                        index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                    } hover:bg-custom-golden-100 transition cursor-pointer`}
                                    onClick={() => {
                                        setSelectedOffer(offer);
                                        setShowDetails(true);
                                    }}
                                >
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200 font-medium">{offer.withdrawLocation}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{offer.returnLocation}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                        {new Date(offer.availableFrom).toLocaleDateString("es-ES")} -{" "}
                                        {new Date(offer.availableTo).toLocaleDateString("es-ES")} - (
                                        {calculateTotalDays(String(offer.availableFrom), String(offer.availableTo))} días)
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">€ {offer.pricePerDay}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{offer.vehicle.capacity}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                        {vehicleOfferTypeMap[offer.vehicleOfferType as keyof typeof vehicleOfferTypeMap]}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{offer.vehicle.brand}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{offer.vehicle.plate || "—"}</td>
                                    <td
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2"
                                    >
                                        <button
                                            onClick={() => {
                                                setSelectedOffer(offer);
                                                setShowEdit(true);
                                            }}
                                            className="text-custom-golden-600 hover:text-custom-golden-700 cursor-pointer"
                                        >
                                            <Pencil className="h-4 w-4 inline-block" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedOffer(offer);
                                                DeleteToast(offer.id, handleDelete);
                                            }}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4 inline-block" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center w-full py-4 text-custom-gray-500">
                                        No se encontraron ofertas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modales */}
            {showCreate && <CreateVehicleOfferModal onClose={() => setShowCreate(false)} onSuccess={setOffers} vehicles={vehicles} owners={users} />}
            {showEdit && selectedOffer && (
                <EditVehicleOfferModal
                    offer={selectedOffer}
                    onClose={() => {
                        setShowEdit(false);
                        setSelectedOffer(null);
                    }}
                    afterEdit={(updatedOffer: VehicleOffersAdminResponse) => {
                        setOffers((prev) => prev.map((o) => (o.id === updatedOffer.id ? updatedOffer : o)));
                    }}
                    vehicles={vehicles}
                    owners={users}
                />
            )}
            {showDetails && selectedOffer && (
                <VehicleOfferDetailsModal
                    onClose={() => {
                        setShowDetails(false);
                        setSelectedOffer(null);
                    }}
                    offer={selectedOffer}
                />
            )}
        </div>
    );
}
