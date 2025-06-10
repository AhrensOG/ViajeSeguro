import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import SkeletonTable from "../SkeletonTable";
import { PaymentResponse, UsersWithReservations } from "@/lib/api/admin/payments/payments.type";
import PaymentDetailModal from "./auxliarComponents.tsx/PaymentsDetailsModal";
import CreatePaymentModal from "./auxliarComponents.tsx/CreatePaymentModal";
import { deletePay, getPayments, getUserReduceWhitReservations } from "@/lib/api/admin/payments/intex";
import UpdatePaymentModal from "./auxliarComponents.tsx/UpdatePaymentModal";
import { toast } from "sonner";
import DeleteToast from "../DeleteToast";

const paymentMethods = ["CASH", "OTHER", "STRIPE"];
const paymentStatuses = ["PENDING", "PAID", "FAILED"];

export default function PaymentsPanel() {
    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [users, setUsers] = useState<UsersWithReservations[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [methodFilter, setMethodFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectPayment, setSelectPayment] = useState<PaymentResponse | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const paym = await getPayments();
                setPayments(paym as PaymentResponse[]);
                const u = await getUserReduceWhitReservations();
                setUsers(u.map((u) => ({ id: u.id, email: u.email, reservations: u.reservations })));
            } catch (error) {
                console.error("Error al cargar pagos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const filteredPayments = payments.filter((p) => {
        const matchesSearch = `${p.user?.name + " " + p.user?.lastName} ${p.user?.email}`.toLowerCase().includes(search.toLowerCase());
        const matchesMethod = methodFilter ? p.method === methodFilter : true;
        const matchesStatus = statusFilter ? p.status === statusFilter : true;
        return matchesSearch && matchesMethod && matchesStatus;
    });

    const handleDelete = async (id: string): Promise<void> => {
        try {
            await deletePay(id ?? "");
            setPayments((prevPayments) => prevPayments.filter((payment) => payment.id !== id));
            setSelectPayment(null);
            toast.success("Pago eliminado exitosamente");
        } catch {
            toast.info("Error al eliminar el pago");
        }
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden pb-2">
            <h1 className="text-2xl font-bold mb-4 text-custom-golden-600">Panel de Pagos</h1>

            {/* Filtros y acción */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-3/4">
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pl-10 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                        />
                        <Search className="absolute top-2.5 left-2.5 h-5 w-5 text-custom-gray-400" />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-custom-gray-300 rounded-md px-3 py-3 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                    >
                        <option value="">Todos los estados</option>
                        {paymentStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="border border-custom-gray-300 rounded-md px-3 py-3 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                    >
                        <option value="">Todos los métodos</option>
                        {paymentMethods.map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => {
                        setIsCreateModalOpen(true);
                    }}
                    className="bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold px-4 py-2 rounded-md flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Crear nuevo pago
                </button>
            </div>

            {loading ? (
                <SkeletonTable rows={5} />
            ) : (
                <div className="flex-1 w-full bg-custom-white-100 rounded-xl shadow-sm border border-custom-gray-200 overflow-auto flex flex-col">
                    <table className="min-w-full text-sm text-left table-fixed border-separate border-spacing-0">
                        <thead className="bg-custom-golden-100 text-custom-golden-700 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Nombre</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Email</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Monto</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Método</th>
                                <th className="px-4 py-2 border-b border-r border-custom-gray-300">Estado</th>
                                <th className="px-4 py-2 border-b border-custom-gray-300 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-custom-black-800">
                            {filteredPayments.map((payment, index) => (
                                <tr
                                    onClick={() => {
                                        setSelectPayment(payment);
                                        setIsDetailModalOpen(true);
                                    }}
                                    key={payment.id}
                                    className={`$${
                                        index % 2 === 0 ? "bg-custom-white-50" : "bg-custom-gray-100"
                                    } hover:bg-custom-golden-100 transition`}
                                >
                                    <td className="px-4 py-2 font-medium border-b border-r border-custom-gray-200">{payment.user?.name}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{payment?.user?.email}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">€ {payment.amount.toFixed(2)}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{payment.method}</td>
                                    <td className="px-4 py-2 border-b border-r border-custom-gray-200">{payment.status}</td>
                                    <td className="px-4 py-2 border-b border-custom-gray-200 text-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectPayment(payment);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-custom-golden-600 hover:text-custom-golden-700 cursor-pointer"
                                            aria-label="Editar"
                                        >
                                            <Pencil className="h-4 w-4 inline-block" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectPayment(payment);
                                                DeleteToast(payment.id, handleDelete);
                                            }}
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
            {isDetailModalOpen && <PaymentDetailModal payment={selectPayment as PaymentResponse} onClose={() => setIsDetailModalOpen(false)} />}
            {isCreateModalOpen && (
                <CreatePaymentModal
                    onClose={() => setIsCreateModalOpen(false)}
                    userOptions={users as UsersWithReservations[]}
                    onSuccess={() => window.location.reload()}
                />
            )}
            {isEditModalOpen && selectPayment && (
                <UpdatePaymentModal
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={{
                        id: selectPayment.id,
                        amount: selectPayment.amount,
                        method: selectPayment.method as "STRIPE" | "CASH" | "OTHER",
                        status: selectPayment.status as "PENDING" | "COMPLETED" | "FAILED",
                        userId: selectPayment.user?.id ?? "",
                        reservationId: selectPayment.reservation?.id ?? "",
                    }}
                    userOptions={users as UsersWithReservations[]}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </div>
    );
}
