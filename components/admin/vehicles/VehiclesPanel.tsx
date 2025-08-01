"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SkeletonTable from "../SkeletonTable";
import DeleteToast from "../DeleteToast";
import { Vehicle } from "@/lib/api/admin/vehicles/vehicles.type";
import CreateVehicleModal from "./auxiliarComponents/CreateVehicleModal";
import EditVehicleModal from "./auxiliarComponents/EditVehicleModal";
import VehicleDetailsModal from "./auxiliarComponents/VehicleDetailsModal";
import { deleteVehicle, getOwners, getVehicles } from "@/lib/api/admin/vehicles";
import { User } from "@/lib/api/reservation/reservation.types";

const transmissionTypeMap = {
    MANUAL: "Manual",
    AUTOMATIC: "Automática",
} as const;

const fuelTypeMap = {
    DIESEL: "Diésel",
    GASOLINE: "Nafta",
    ELECTRIC: "Eléctrico",
    HYBRID: "Híbrido",
} as const;

const serviceTypeMap: Record<string, string> = {
    SIMPLE_TRIP: "Viaje simple",
    RENTAL_WITH_DRIVER: "Con chofer",
    RENTAL_WITHOUT_DRIVER: "Sin chofer",
};

const providerMap: Record<string, string> = {
    VS: "Viaje Seguro",
    PARTNER: "Particular",
} as const;

export default function VehiclesPanel() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [owners, setOwners] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingOwners, setLoadingOwners] = useState(true);
    const [search, setSearch] = useState("");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await getVehicles();
                setVehicles(res);
            } catch (error) {
                toast.info(error instanceof Error ? error.message : "Error al cargar vehículos");
            } finally {
                setLoading(false);
            }
        };
        const fecthOwners = async () => {
            try {
                const res = await getOwners();
                setOwners(res);
            } catch (error) {
                toast.info(error instanceof Error ? error.message : "Error al cargar propietarios");
            } finally {
                setLoadingOwners(false);
            }
        };
        fetchVehicles();
        fecthOwners();
    }, []);

    const filteredVehicles = vehicles.filter((vehicle) => `${vehicle.plate} ${vehicle.provider}`.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = async (id: string) => {
        try {
            await deleteVehicle(id);
            setVehicles((prev) => prev.filter((v) => v.id !== id));
            toast.success("Vehículo eliminado correctamente");
        } catch {
            toast.error("Error al eliminar el vehículo");
        }
    };

    const handleUpdateVehicle = (updated: Vehicle) => {
        setVehicles((prev) => prev.map((v) => (v.id === updated.id ? { ...v, ...updated } : v)));
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold text-custom-golden-600">Panel de Vehículos</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Añadir vehículo
                </button>
            </div>

            {/* Buscador */}
            <div className="relative mb-4 max-w-md">
                <input
                    type="text"
                    placeholder="Buscar por placa o proveedor"
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute top-2.5 left-2.5 h-5 w-5 text-custom-gray-400" />
            </div>

            {loading && loadingOwners ? (
                <SkeletonTable rows={5} />
            ) : (
                <div className="flex-1 w-full bg-custom-white-100 rounded-xl shadow-sm border border-custom-gray-200 overflow-auto">
                    <table className="min-w-full text-sm text-left table-fixed border-separate border-spacing-0">
                        <thead className="bg-custom-golden-100 text-custom-golden-700 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Placa</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Marca</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Marca</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Año</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Capacidad</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Servicio</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Combustible</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Transmisión</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Proveedor</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Asientos</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Propietario</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="text-custom-black-800">
                            {filteredVehicles.map((vehicle, index) => (
                                <tr
                                    key={vehicle.id}
                                    className={`${
                                        index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                    } hover:bg-custom-golden-100 transition`}
                                    onClick={() => {
                                        setSelectedVehicle(vehicle);
                                        setIsViewModalOpen(true);
                                    }}
                                >
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200 font-medium">{vehicle.plate || "Sin placa"}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{vehicle.brand}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200"> {vehicle.model}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{vehicle.year}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{vehicle.capacity}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{serviceTypeMap[vehicle.serviceType]}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{fuelTypeMap[vehicle.fuelType]}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                        {transmissionTypeMap[vehicle.transmissionType]}
                                    </td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{providerMap[vehicle.provider]}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{vehicle.allowSeatSelection ? "Sí" : "No"}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                        {vehicle.owner?.name} {vehicle.owner?.lastName && `- ${vehicle.owner.lastName}`}
                                    </td>

                                    <td className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedVehicle(vehicle);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-custom-golden-600 hover:text-custom-golden-700"
                                        >
                                            <Pencil className="h-4 w-4 inline-block" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                DeleteToast(vehicle.id, handleDelete);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 inline-block" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredVehicles.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-custom-gray-500">
                                        No se encontraron vehículos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isCreateModalOpen && <CreateVehicleModal onClose={() => setIsCreateModalOpen(false)} owners={owners} onSuccess={setVehicles} />}
            {isEditModalOpen && selectedVehicle && (
                <EditVehicleModal
                    onClose={() => setIsEditModalOpen(false)}
                    owners={owners}
                    onSuccess={handleUpdateVehicle}
                    vehicle={selectedVehicle}
                />
            )}
            {isViewModalOpen && selectedVehicle && <VehicleDetailsModal onClose={() => setIsViewModalOpen(false)} vehicle={selectedVehicle} />}
        </div>
    );
}
