import React, { useEffect, useState } from "react";
import { fetchReferrals, Referral } from "@/lib/api/admin/referrals";
import { Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ReferralsPanel() {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchReferrals()
            .then(setReferrals)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredReferrals = referrals.filter((ref) => {
        const query = search.toLowerCase();
        return (
            ref.referrer.name.toLowerCase().includes(query) ||
            ref.referrer.lastName.toLowerCase().includes(query) ||
            ref.referrer.email.toLowerCase().includes(query) ||
            ref.referred.name.toLowerCase().includes(query) ||
            ref.referred.lastName.toLowerCase().includes(query) ||
            ref.referred.email.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-custom-golden-600" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-custom-gray-50 min-h-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-custom-black-900">Panel de Referidos</h1>
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre o email..."
                        className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pl-10 focus:ring-custom-golden-500 focus:border-custom-golden-500"
                    />
                    <Search className="absolute top-2.5 left-3 h-5 w-5 text-custom-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-custom-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-custom-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Quien Refirió</th>
                                <th className="px-6 py-3">Quien fue Referido</th>
                                <th className="px-6 py-3">Estado Recompensa</th>
                                <th className="px-6 py-3">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredReferrals.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center">
                                        {search ? "No se encontraron resultados para tu búsqueda." : "No hay referidos registrados."}
                                    </td>
                                </tr>
                            ) : (
                                filteredReferrals.map((ref) => (
                                    <tr key={ref.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-custom-black-900">{ref.referrer.name} {ref.referrer.lastName}</div>
                                            <div className="text-xs text-gray-500">{ref.referrer.email}</div>
                                            <div className="mt-1">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    Referidos: {ref.referrer._count.referralsFrom}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-custom-black-900">{ref.referred.name} {ref.referred.lastName}</div>
                                            <div className="text-xs text-gray-500">{ref.referred.email}</div>
                                            <div className="mt-1">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                    Viajes: {ref.referred._count.reservations}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ref.rewardStatus === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                                ref.rewardStatus === 'USED' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {ref.rewardStatus === 'AVAILABLE' ? 'Disponible' :
                                                    ref.rewardStatus === 'USED' ? 'Usado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {format(new Date(ref.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
