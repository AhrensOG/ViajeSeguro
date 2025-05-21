import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SkeletonTable from "../SkeletonTable";
import { ReservationResponse, SimpleReservation } from "@/lib/api/admin/reservation/reservation.types";

export default function ReservationPanel() {
    const [reservations, setReservations] = useState<SimpleReservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await fetchWithAuth(`${BACKEND_URL}/reservation/all`);
                console.log("Reservas:", res);
                if (!Array.isArray(res)) {
                    throw new Error("La respuesta de reservas no es un array");
                }
                const mapped = res.map(
                    (r: ReservationResponse): SimpleReservation => ({
                        id: r.id,
                        guestName: r.user?.name + " " + r.user?.lastName || "Invitado",
                        email: r.user?.email || "",
                        price: r.price ?? 0,
                        status: r.status,
                        paymentMethod: r.paymentMethod,
                        createdAt: r.createdAt,
                    })
                );
                setReservations(mapped);
            } catch (error) {
                console.error("Error al cargar reservas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <h1 className="text-2xl font-bold mb-4 text-custom-golden-600">Panel de Reservas</h1>

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
                            {reservations.map((reservation, index) => (
                                <tr
                                    key={reservation.id}
                                    className={`${
                                        index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                    } hover:bg-custom-golden-100 transition`}
                                >
                                    <td className="px-4 py-2 font-medium border-b border-r border-custom-gray-200">{reservation.guestName}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{reservation.email}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">€ {reservation.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{reservation.paymentMethod}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{reservation.status}</td>
                                    <td className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2">
                                        <button
                                            onClick={() => console.log("Editar", reservation)}
                                            className="text-custom-golden-600 hover:text-custom-golden-700"
                                            aria-label="Editar"
                                        >
                                            <Pencil className="h-4 w-4 inline-block" />
                                        </button>
                                        <button
                                            onClick={() => console.log("Eliminar", reservation)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4 inline-block" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
