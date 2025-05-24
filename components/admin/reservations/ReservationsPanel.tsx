import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import SkeletonTable from "../SkeletonTable";
import { ReservationResponse, TripOption, UserOption } from "@/lib/api/admin/reservation/reservation.types";
import ReservationDetailModal from "./auxiliarComponents/ReservationDetailsModal";
import { deleteRes, getAllReservations, getReduceTrip } from "@/lib/api/admin/reservation/intex";
import CreateReservationModal from "./auxiliarComponents/CreateReservationModal";
import EditReservationModal from "./auxiliarComponents/EditReservationModal";
import { getReduceUser } from "@/lib/shared";
import { toast } from "sonner";
import DeleteToast from "../DeleteToast";

const statusOptions = ["CONFIRMED", "PENDING", "CANCELLED"];
const paymentOptions = ["STRIPE", "CASH", "OTHER"];

export default function ReservationPanel() {
    const [reservations, setReservations] = useState<ReservationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [methodFilter, setMethodFilter] = useState<string>("ALL");
    const [selectedReservation, setSelectedReservation] = useState<ReservationResponse | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [trips, setTrips] = useState<TripOption[]>([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const reservations = await getAllReservations();
                if (!Array.isArray(reservations)) throw new Error("La respuesta de reservas no es un array");
                setReservations(reservations);
                const users = await getReduceUser();
                if (!Array.isArray(users)) throw new Error("La respuesta de usuarios no es un array");
                setUsers(users);
                const trips = await getReduceTrip();
                if (!Array.isArray(trips)) throw new Error("La respuesta de viajes no es un array");
                setTrips(
                    trips.map((trip) => ({
                        id: trip.id,
                        label: `${trip.origin} - ${trip.destination}`,
                        date: `${new Date(trip.departure).toLocaleDateString()} ${new Date(trip.departure).toLocaleTimeString()}`,
                    }))
                );
            } catch (error) {
                console.error("Error al cargar reservas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const filteredReservations = reservations.filter((r) => {
        const guestName = `${r.user?.name ?? ""} ${r.user?.lastName ?? ""}`.trim();
        const guestEmail = r.user?.email ?? "";
        const matchesSearch =
            guestName.toLowerCase().includes(searchTerm.toLowerCase()) || guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
        const matchesMethod = methodFilter === "ALL" || r.paymentMethod === methodFilter;
        return matchesSearch && matchesStatus && matchesMethod;
    });

    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deleteRes(id ?? "");
            setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== id));
            setSelectedReservation(null);
            toast.success("Usuario eliminado exitosamente");
        } catch {
            toast.info("Error al eliminar el usuario");
        }
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <h1 className="text-2xl font-bold mb-4 text-custom-golden-600">Panel de Reservas</h1>

            {/* Filtros y acción */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-3/4">
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pl-10 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                        />
                        <Search className="absolute top-2.5 left-2.5 h-5 w-5 text-custom-gray-400" />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-custom-gray-300 rounded-md px-3 py-2 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                    >
                        <option value="ALL">Todos los estados</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="border border-custom-gray-300 rounded-md px-3 py-2 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                    >
                        <option value="ALL">Todos los métodos</option>
                        {paymentOptions.map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Crear reserva
                </button>
            </div>

            {loading ? (
                <SkeletonTable rows={5} />
            ) : (
                <div className="flex-1 w-full bg-custom-white-100 rounded-xl shadow-sm border border-custom-gray-200 overflow-hidden flex flex-col">
                    <table className="min-w-full text-sm text-left table-fixed border-separate border-spacing-0">
                        <thead className="bg-custom-golden-100 text-custom-golden-700 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Nombre</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Email</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Precio</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Método</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Estado</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-custom-black-800">
                            {filteredReservations.map((r, index) => {
                                const guestName = `${r.user?.name ?? "Invitado"} ${r.user?.lastName ?? ""}`.trim();
                                const guestEmail = r.user?.email ?? "";

                                return (
                                    <tr
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedReservation(r);
                                            setIsViewModalOpen(true);
                                        }}
                                        key={r.id}
                                        className={`$${
                                            index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                        } hover:bg-custom-golden-100 transition`}
                                    >
                                        <td className="px-4 py-2 font-medium border-b border-r border-custom-gray-200">{guestName}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">{guestEmail}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">€ {r.price.toFixed(2)}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">{r.paymentMethod}</td>
                                        <td className="px-4 py-2 border-b border-r border-custom-gray-200">{r.status}</td>
                                        <td className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsEditingModalOpen(true);
                                                }}
                                                className="text-custom-golden-600 hover:text-custom-golden-700 cursor-pointer"
                                                aria-label="Editar"
                                            >
                                                <Pencil className="h-4 w-4 inline-block" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedReservation(r);
                                                    DeleteToast(r.id, handleDelete);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4 inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {isViewModalOpen && selectedReservation && (
                <ReservationDetailModal reservation={selectedReservation} onClose={() => setIsViewModalOpen(false)} />
            )}
            {isCreateModalOpen && (
                <CreateReservationModal
                    users={users}
                    trips={trips}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
            {isEditingModalOpen && selectedReservation && (
                <EditReservationModal
                    users={users}
                    trips={trips}
                    onClose={() => setIsEditingModalOpen(false)}
                    initialData={{
                        tripId: selectedReservation.trip?.id ?? "",
                        price: selectedReservation.price,
                        status: selectedReservation.status,
                        paymentMethod: selectedReservation.paymentMethod as "STRIPE" | "CASH" | "OTHER",
                        seatCode: selectedReservation.seatCode,
                        discountId: selectedReservation.discountId,
                        id: selectedReservation.id,
                        userId: selectedReservation.user?.id,
                    }}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </div>
    );
}
