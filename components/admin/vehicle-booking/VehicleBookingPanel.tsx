"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import SkeletonTable from "../SkeletonTable";
import { deleteVehicleBooking, fetchSimpleOffers, fetchSimpleUsers, fetchVehicleBookingsAdmin } from "@/lib/api/admin/vehicle-bookings";
import { SimpleOffer, SimpleUser, SimpleVehicle, VehicleBookingResponseAdmin } from "@/lib/api/admin/vehicle-bookings/vehicleBookings.types";
import VehicleBookingDetailsModal from "./auxiliarComponents/VehicleBookingDetailsModal";
import EditVehicleBookingModal from "./auxiliarComponents/EditVehicleBookingModal";
import CreateVehicleBookingModal from "./auxiliarComponents/CreateVehicleBookingModal";
import { toast } from "sonner";
import DeleteToast from "../DeleteToast";
import { fetchSimpleVehicles } from "@/lib/api/admin/vehicle-offers";
import CustomSelect from "./auxiliarComponents/CustomSelect";

const statusMap = {
    PENDING: "Pendiente",
    APPROVED: "Aprobada",
    DECLINED: "Declinada",
    CANCELLED: "Cancelada",
    FINISHED: "Finalizada",
    COMPLETED: "Completada",
};

export default function VehicleBookingPanel() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState<VehicleBookingResponseAdmin[]>([]);
    const [users, setUsers] = useState<SimpleUser[]>([]);
    const [offers, setOffers] = useState<SimpleOffer[]>([]);
    const [vehicles, setVehicles] = useState<SimpleVehicle[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<VehicleBookingResponseAdmin | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [filters, setFilters] = useState({
        vehicle: "",
        withdrawLocation: "",
        returnLocation: "",
        status: "",
        startDate: "",
        endDate: "",
        maxPrice: "",
    });

    useEffect(() => {
        const getBookings = async () => {
            try {
                setLoading(true);
                const bookings = await fetchVehicleBookingsAdmin();
                const users = await fetchSimpleUsers();
                const offers = await fetchSimpleOffers();
                const vehicles = await fetchSimpleVehicles();

                setUsers(users as SimpleUser[]);
                setOffers(offers as SimpleOffer[]);
                setVehicles(vehicles as SimpleVehicle[]);
                setBookings(bookings as VehicleBookingResponseAdmin[]);
            } catch {
                toast.info("Error al obtener los datos");
            } finally {
                setLoading(false);
            }
        };

        getBookings();
    }, []);

    const filtered = bookings.filter((b) => {
        const fullName = `${b.renter?.name || ""} ${b.renter?.lastName || ""}`.toLowerCase();
        const email = b.renter?.email?.toLowerCase() || "";

        const matchSearch = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
        const matchVehicle = filters.vehicle === "" || b.offer.vehicle.id === filters.vehicle;
        const matchStart = filters.startDate === "" || new Date(b.startDate) >= new Date(filters.startDate);
        const matchEnd = filters.endDate === "" || new Date(b.endDate) <= new Date(filters.endDate);
        const matchWithdraw = filters.withdrawLocation === "" || b.offer.withdrawLocation.includes(filters.withdrawLocation);
        const matchReturn = filters.returnLocation === "" || b.offer.returnLocation.includes(filters.returnLocation);
        const matchStatus = filters.status === "" || b.status === filters.status;
        const matchPrice = filters.maxPrice === "" || b.totalPrice <= Number(filters.maxPrice);

        return matchSearch && matchVehicle && matchStart && matchEnd && matchWithdraw && matchReturn && matchStatus && matchPrice;
    });

    const clearFilters = () => {
        setFilters({
            vehicle: "",
            withdrawLocation: "",
            returnLocation: "",
            status: "",
            startDate: "",
            endDate: "",
            maxPrice: "",
        });
    };

    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deleteVehicleBooking(id);
            setBookings((prev) => prev.filter((b) => b.id !== id));
            setSelectedBooking(null);
            toast.success("Reserva eliminada exitosamente");
        } catch {
            toast.error("Error al eliminar la reserva");
        }
    };

    const vehicleOptions = vehicles.map((v) => ({
        label: `${v.brand} ${v.model} - ${v.plate || "sin matrícula"}`,
        value: v.id,
    }));
    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold text-custom-golden-600">Panel de Reservas de Vehículos</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Nueva reserva
                </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-custom-white-100 p-4 border border-custom-gray-300 rounded-md mb-4">
                <div className="relative col-span-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre o email"
                        className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pl-10"
                    />
                    <Search className="absolute top-2.5 left-2.5 h-5 w-5 text-custom-gray-400" />
                </div>

                <CustomSelect
                    options={vehicleOptions}
                    value={filters.vehicle}
                    onChange={(val) => setFilters((f) => ({ ...f, vehicle: val }))}
                    placeholder="Todos los vehículos"
                />

                <CustomSelect
                    options={[...new Set(offers.map((o) => ({ label: o.withdrawLocation, value: o.withdrawLocation })))]}
                    value={filters.withdrawLocation}
                    onChange={(val) => setFilters((f) => ({ ...f, withdrawLocation: val }))}
                    placeholder="Todos los inicios"
                />

                <CustomSelect
                    options={[...new Set(offers.map((o) => ({ label: o.returnLocation, value: o.returnLocation })))]}
                    value={filters.returnLocation}
                    onChange={(val) => setFilters((f) => ({ ...f, returnLocation: val }))}
                    placeholder="Todos los destinos"
                />

                <select
                    value={filters.status}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                >
                    <option value="">Todos los estados</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="APPROVED">Aprobado</option>
                    <option value="DECLINED">Declinado</option>
                    <option value="CANCELLED">Cancelado</option>
                    <option value="COMPLETED">Completado</option>
                    <option value="FINISHED">Finalizado</option>
                </select>
                <input
                    type="date"
                    value={filters.startDate}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
                />
                <input
                    type="date"
                    value={filters.endDate}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
                />
                <input
                    type="number"
                    placeholder="Precio máximo"
                    value={filters.maxPrice}
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                />
                <button
                    onClick={clearFilters}
                    className="col-span-2 md:col-span-1 bg-custom-gray-300 hover:bg-custom-gray-400 text-black px-4 py-2 rounded-md shadow-sm"
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
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Cliente</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Email</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Inicio</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Destino</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Vehículo</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Desde</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Hasta</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Estado</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Total</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-custom-black-800">
                            {filtered.map((b, index) => (
                                <tr
                                    onClick={() => {
                                        setSelectedBooking(b);
                                        setShowDetails(true);
                                    }}
                                    key={b.id}
                                    className={`${
                                        index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                    } hover:bg-custom-golden-100 transition cursor-pointer`}
                                >
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200 font-medium">
                                        {b.renter.name} {b.renter.lastName}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{b.renter.email}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{b.offer.withdrawLocation}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{b.offer.returnLocation}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                        {b.offer.vehicle.brand} {b.offer.vehicle.model} ({b.offer.vehicle.year}) - {b.offer.vehicle.plate}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                        {new Date(b.startDate).toLocaleDateString("es-ES")}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                        {new Date(b.endDate).toLocaleDateString("es-ES")}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                        {statusMap[b.status as keyof typeof statusMap]}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">€{b.totalPrice.toFixed(2)}</td>
                                    <td
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2"
                                    >
                                        <button
                                            onClick={() => {
                                                setSelectedBooking(b);
                                                setShowEdit(true);
                                            }}
                                            className="text-custom-golden-600 hover:text-custom-golden-700 cursor-pointer"
                                        >
                                            <Pencil className="h-4 w-4 inline-block" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedBooking(b);
                                                DeleteToast(b.id, handleDelete);
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
                                    <td colSpan={10} className="text-center py-4 text-custom-gray-500">
                                        No se encontraron reservas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showDetails && selectedBooking && (
                <VehicleBookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => {
                        setShowDetails(false);
                        setSelectedBooking(null);
                    }}
                />
            )}

            {showEdit && selectedBooking && (
                <EditVehicleBookingModal
                    booking={selectedBooking}
                    onClose={() => {
                        setShowEdit(false);
                        setSelectedBooking(null);
                    }}
                    onSuccess={setBookings}
                    renters={users}
                    offers={offers}
                />
            )}

            {showCreate && <CreateVehicleBookingModal onClose={() => setShowCreate(false)} onSuccess={setBookings} renters={users} offers={offers} />}
        </div>
    );
}
