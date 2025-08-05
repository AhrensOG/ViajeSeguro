"use client";

import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import SkeletonTable from "../SkeletonTable";
import { CreateTripRequest, Driver, Partner, TripResponse } from "@/lib/api/admin/trips/trips.type";
import TripDetailsModal from "./auxiliarComponents/TripDetailsModal";
import CreateTripModal from "./auxiliarComponents/CreateTripModal";
import { toast } from "sonner";
import { deleteTrip, getAllTrips, getDrivers, getPartners } from "@/lib/api/admin/trips";
import EditTripModal from "./auxiliarComponents/EditTripModal";
import DeleteToast from "../DeleteToast";

export default function TripsPanel() {
    const [trips, setTrips] = useState<TripResponse[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]); // Assuming you have a Driver type defined
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<TripResponse | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        origin: "",
        destination: "",
        departure: "",
        arrival: "",
        capacity: "",
        status: "",
        driver: "",
    });

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await getAllTrips();
                setTrips(res);
            } catch {
                toast.info("Error al cargar los viajes");
            } finally {
                setLoading(false);
            }
        };
        const fetchDrivers = async () => {
            try {
                const res = await getDrivers();
                if (!Array.isArray(res)) throw new Error("La respuesta del backend no es un array de conductores");
                setDrivers(res);
            } catch {
                toast.info("Error al cargar los conductores");
            }
        };
        const fetchPartners = async () => {
            try {
                const res = await getPartners();
                if (!Array.isArray(res)) throw new Error("La respuesta del backend no es un array de propietarios");
                setPartners(res);
            } catch {
                toast.info("Error al cargar los propietarios");
            }
        };
        fetchTrips();
        fetchDrivers();
        fetchPartners();
    }, []);

    const now = new Date();

    const filteredTrips = trips.filter((trip) => {
        const matchesSearch = `${trip.origin} ${trip.destination}`.toLowerCase().includes(search.toLowerCase());
        const matchesOrigin = filters.origin.toLowerCase() ? trip.origin.toLowerCase().includes(filters.origin.toLowerCase()) : true;
        const matchesDestination = filters.destination.toLowerCase()
            ? trip.destination.toLowerCase().includes(filters.destination.toLowerCase())
            : true;
        const matchesDeparture = filters.departure ? trip.departure.startsWith(filters.departure) : true;
        const matchesArrival = filters.arrival ? trip.arrival.startsWith(filters.arrival) : true;
        const matchesCapacity = filters.capacity ? trip.capacity.toString() === filters.capacity || trip.capacity > parseInt(filters.capacity) : true;
        const matchesStatus = filters.status ? trip.status === filters.status : true;
        const matchesDriver = filters.driver ? trip.driverId === filters.driver : true;

        return (
            matchesSearch &&
            matchesOrigin &&
            matchesDestination &&
            matchesDeparture &&
            matchesArrival &&
            matchesCapacity &&
            matchesStatus &&
            matchesDriver
        );
    });

    const upcomingTrips = filteredTrips
        .filter((trip) => new Date(trip.departure) >= now)
        .sort((a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime());

    const pastTrips = filteredTrips
        .filter((trip) => new Date(trip.departure) < now)
        .sort((a, b) => new Date(b.departure).getTime() - new Date(a.departure).getTime());

    const orderedTrips = [...upcomingTrips, ...pastTrips];

    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deleteTrip(id ?? "");
            setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
            setSelectedTrip(null);
            toast.success("Viaje eliminado exitosamente");
        } catch {
            toast.info("Error al eliminar el viaje");
        }
    };

    // Solución 1: Mantener el objeto driver después de editar un viaje
    const handleUpdateTrip: React.Dispatch<React.SetStateAction<TripResponse[]>> = (updater) => {
        setTrips((prevTrips) => {
            const updated = typeof updater === "function" ? updater(prevTrips) : updater;
            return updated.map((trip) => {
                const driver = drivers.find((d) => d.id === trip.driverId);
                return { ...trip, driver: driver || null };
            });
        });
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold text-custom-golden-600">Panel de Viajes</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="cursor-pointer flex items-center gap-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Crear viaje
                </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-custom-white-100 p-4 border border-custom-gray-300 rounded-md mb-4">
                <div className="relative col-span-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por origen o destino"
                        className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pl-10"
                    />
                    <Search className="absolute top-2.5 left-2.5 h-5 w-5 text-custom-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Origen"
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, origin: e.target.value }))}
                />
                <input
                    type="text"
                    placeholder="Destino"
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, destination: e.target.value }))}
                />
                <input
                    type="date"
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, departure: e.target.value }))}
                />
                <input
                    type="date"
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, arrival: e.target.value }))}
                />
                <input
                    type="number"
                    placeholder="Capacidad"
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, capacity: e.target.value }))}
                />
                <select
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                >
                    <option value="">Todos los estados</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="CONFIRMED">Confirmado</option>
                    <option value="CANCELLED">Cancelado</option>
                    <option value="FINISHED">Finalizado</option>
                </select>
                <select
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    value={filters.driver}
                    onChange={(e) => setFilters((f) => ({ ...f, driver: e.target.value }))}
                >
                    <option value="">Todos los conductores</option>
                    {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                            {driver.name} {driver.lastName} - {driver.email}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla de viajes */}
            {loading ? (
                <SkeletonTable rows={5} />
            ) : (
                <div className="flex-1 w-full bg-custom-white-100 rounded-xl shadow-sm border border-custom-gray-200 overflow-auto flex flex-col">
                    <table className="min-w-full text-sm text-left table-fixed border-separate border-spacing-0">
                        <thead className="bg-custom-golden-100 text-custom-golden-700 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Origen</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Destino</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Salida</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Llegada</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Precio</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Capacidad</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Estado</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center">Conductor</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-custom-black-800">
                            {orderedTrips.length > 0 ? (
                                orderedTrips.map((trip, index) => (
                                    <tr
                                        onClick={() => {
                                            setSelectedTrip(trip);
                                            setIsViewModalOpen(true);
                                        }}
                                        key={trip.id}
                                        className={`$${
                                            index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                        } hover:bg-custom-golden-100 transition cursor-pointer`}
                                    >
                                        <td className="px-4 py-2 font-medium border-b border-r border-custom-gray-200">{trip.origin} </td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">{trip.destination}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                            {new Date(trip.departure).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                            {new Date(trip.arrival).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">€ {trip.basePrice.toFixed(2)}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">{trip.capacity}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">{trip.status}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                            {trip.driver ? (
                                                <span>
                                                    {trip.driver.name} {trip.driver.lastName} - {trip.driver.email}
                                                </span>
                                            ) : (
                                                <span className="text-custom-gray-500">Sin conductor asignado</span>
                                            )}
                                        </td>
                                        <td
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2"
                                        >
                                            <button
                                                onClick={() => {
                                                    setSelectedTrip(trip);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="cursor-pointer text-custom-golden-600 hover:text-custom-golden-700"
                                                aria-label="Editar"
                                            >
                                                <Pencil className="h-4 w-4 inline-block" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedTrip(trip);
                                                    DeleteToast(trip.id, handleDelete);
                                                }}
                                                className="cursor-pointer text-red-500 hover:text-red-700"
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4 inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-custom-gray-500">
                                        No se encontraron viajes que coincidan con los filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isViewModalOpen && selectedTrip && (
                <TripDetailsModal
                    trip={{ ...selectedTrip, reservations: selectedTrip.reservations ?? [] }}
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}
            {isCreateModalOpen && (
                <CreateTripModal onClose={() => setIsCreateModalOpen(false)} onSuccess={setTrips} partners={partners} drivers={drivers} />
            )}
            {isEditModalOpen && selectedTrip && (
                <EditTripModal
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={handleUpdateTrip}
                    partners={partners}
                    drivers={drivers}
                    trip={selectedTrip as CreateTripRequest}
                />
            )}
        </div>
    );
}
