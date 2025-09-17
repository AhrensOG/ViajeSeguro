"use client";

import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import SkeletonTable from "../SkeletonTable";
import { toast } from "sonner";
import DeleteToast from "../DeleteToast";
import CreateCityModal from "./auxiliarComponents/CreateCityModal";
import EditCityModal from "./auxiliarComponents/EditCityModal";
import { getAllCities, deleteCity } from "@/lib/api/admin/cities";

// Tipo temporal para las ciudades
interface City {
    id: string;
    name: string;
    state: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function CitiesPanel() {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);

    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        country: "",
        state: "",
        isActive: "",
    });

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await getAllCities();
                setCities(res);
            } catch {
                toast.info("Error al cargar las ciudades");
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    const filteredCities = cities.filter((city) => {
        const matchesSearch = `${city.name} ${city.country}`.toLowerCase().includes(search.toLowerCase());
        const matchesCountry = filters.country.toLowerCase() ? city.country.toLowerCase().includes(filters.country.toLowerCase()) : true;
        const matchesActive = filters.isActive ? city.isActive.toString() === filters.isActive : true;

        return matchesSearch && matchesCountry && matchesActive;
    });

    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deleteCity(id);
            setCities((prevCities) => prevCities.filter((city) => city.id !== id));
            setSelectedCity(null);
            toast.success("Ciudad eliminada exitosamente");
        } catch {
            toast.info("Error al eliminar la ciudad");
        }
    };

    const handleCreateSuccess = (newCity: any) => {
        setCities((prevCities) => [...prevCities, newCity]);
    };

    const handleEditSuccess = (updatedCity: City) => {
        setCities((prevCities) => 
            prevCities.map((city) => 
                city.id === updatedCity.id ? updatedCity : city
            )
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold text-custom-golden-600">Panel de Ciudades</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="cursor-pointer flex items-center gap-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Agregar Ciudad
                </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-custom-white-100 p-4 border border-custom-gray-300 rounded-md mb-4">
                <div className="relative col-span-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por ciudad, país o estado"
                        className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pl-10"
                    />
                    <Search className="absolute top-2.5 left-2.5 h-5 w-5 text-custom-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="País"
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))}
                />
                <input
                    type="text"
                    placeholder="Estado/Región"
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
                />
                <select
                    className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                    onChange={(e) => setFilters((f) => ({ ...f, isActive: e.target.value }))}
                >
                    <option value="">Todos los estados</option>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>

            {/* Tabla de ciudades */}
            {loading ? (
                <SkeletonTable rows={5} />
            ) : (
                <div className="flex-1 w-full bg-custom-white-100 rounded-xl shadow-sm border border-custom-gray-200 overflow-auto flex flex-col">
                    <table className="min-w-full text-sm text-left table-fixed border-separate border-spacing-0">
                        <thead className="bg-custom-golden-100 text-custom-golden-700 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Ciudad</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Estado/Región</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">País</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Estado</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Fecha Creación</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Última Modificación</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-custom-black-800">
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city, index) => (
                                    <tr
                                        key={city.id}
                                        className={`${
                                            index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                        } hover:bg-custom-golden-100 transition cursor-pointer`}
                                    >
                                        <td className="px-4 py-2 font-medium border-b border-r border-custom-gray-200">{city.name}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">{city.state}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">{city.country}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                city.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {city.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                            {formatDate(city.createdAt)}
                                        </td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">
                                            {formatDate(city.updatedAt)}
                                        </td>
                                        <td
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2"
                                        >
                                            <button
                                                onClick={() => {
                                                    setSelectedCity(city);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="cursor-pointer text-custom-golden-600 hover:text-custom-golden-700"
                                                aria-label="Editar"
                                            >
                                                <Pencil className="h-4 w-4 inline-block" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCity(city);
                                                    DeleteToast(city.id, handleDelete);
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
                                    <td colSpan={6} className="text-center py-4 text-custom-gray-500">
                                        No se encontraron ciudades que coincidan con los filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modales */}
            {isCreateModalOpen && (
                <CreateCityModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
            
            {isEditModalOpen && selectedCity && (
                <EditCityModal
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                    city={selectedCity}
                />
            )}
        </div>
    );
}
