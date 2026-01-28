
"use client";

import React, { useEffect, useState } from "react";
import { fetchAdminStats, DashboardStats } from "@/lib/api/admin/stats";
import { Users, Coins, Map, Star, CreditCard, Banknote, Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";

/**
 * StatisticsPanel Component
 * Displays a comprehensive dashboard with key metrics for the platform.
 */
export default function StatisticsPanel() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchAdminStats()
            .then((data) => setStats(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-custom-golden-600" />
            </div>
        );
    }

    if (!stats) return <div className="p-6">Error al cargar estadísticas.</div>;

    // Helper to format currency
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(val);
    };


    return (
        <div className="w-full h-full p-6 overflow-y-auto bg-custom-gray-50">
            <h1 className="text-3xl font-bold text-custom-black-900 mb-2">Panel de Estadísticas</h1>
            <p className="text-custom-gray-500 mb-8">
                Resumen general del rendimiento y métricas clave de Viaje Seguro.
            </p>

            {/* Top Cards: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <StatCard
                    title="Usuarios Totales"
                    value={stats.totalUsers}
                    icon={<Users className="w-8 h-8 text-blue-600" />}
                    bgColor="bg-blue-50"
                    borderColor="border-blue-100"
                    onClick={() => router.push("?sec=usuarios")}
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                >
                    <div className="mt-2 text-sm text-custom-gray-500">
                        Conductores activos: <span className="font-semibold text-custom-black-800">{stats.totalDrivers}</span>
                    </div>
                </StatCard>

                {/* Total Trips */}
                <StatCard
                    title="Viajes Creados"
                    value={stats.totalTrips}
                    icon={<Map className="w-8 h-8 text-purple-600" />}
                    bgColor="bg-purple-50"
                    borderColor="border-purple-100"
                    onClick={() => router.push("?sec=viajes")}
                    className="cursor-pointer hover:bg-purple-100 transition-colors"
                />

                {/* Total Revenue */}
                <StatCard
                    title="Ingresos Totales"
                    value={formatCurrency(stats.revenue.total)}
                    icon={<Coins className="w-8 h-8 text-emerald-600" />}
                    bgColor="bg-emerald-50"
                    borderColor="border-emerald-100"
                    onClick={() => router.push("?sec=pagos")}
                    className="cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                    <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                            Neto Confirmado
                        </span>
                    </div>
                </StatCard>

                {/* Total Referrals */}
                <StatCard
                    title="Usuarios Referidos"
                    value={stats.totalReferrals}
                    icon={<Star className="w-8 h-8 text-yellow-500" />}
                    bgColor="bg-yellow-50"
                    borderColor="border-yellow-100"
                    onClick={() => router.push("?sec=referidos")}
                    className="cursor-pointer hover:bg-yellow-100 transition-colors"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-custom-gray-200 p-6">
                    <h3 className="text-lg font-bold text-custom-black-900 mb-6 flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-custom-golden-600" />
                        Desglose de Ingresos
                    </h3>
                    <div className="space-y-6">
                        <RevenueItem
                            label="Tarjeta / Stripe"
                            amount={stats.revenue.byMethod["CARD"] || 0}
                            total={stats.revenue.total}
                            color="bg-indigo-500"
                            icon={<CreditCard className="w-5 h-5 text-indigo-500" />}
                        />
                        <RevenueItem
                            label="Efectivo"
                            amount={stats.revenue.byMethod["CASH"] || 0}
                            total={stats.revenue.total}
                            color="bg-green-500"
                            icon={<Banknote className="w-5 h-5 text-green-500" />}
                        />
                        {/* Other methods fallback */}
                        {Object.entries(stats.revenue.byMethod).map(([key, val]) => {
                            if (['CARD', 'CASH'].includes(key)) return null;
                            return (
                                <RevenueItem
                                    key={key}
                                    label={key}
                                    amount={val}
                                    total={stats.revenue.total}
                                    color="bg-gray-400"
                                    icon={<Coins className="w-5 h-5 text-gray-400" />}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Trips Status Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-custom-gray-200 p-6">
                    <h3 className="text-lg font-bold text-custom-black-900 mb-6 flex items-center gap-2">
                        <Map className="w-5 h-5 text-custom-golden-600" />
                        Estado de Viajes
                    </h3>

                    <div className="space-y-4">
                        {stats.tripsStatus.length === 0 && <p className="text-gray-500 italic">No hay datos de viajes.</p>}
                        {stats.tripsStatus.map((item) => {
                            const percentage = stats.totalTrips > 0
                                ? Math.round((item.count / stats.totalTrips) * 100)
                                : 0;

                            let statusLabel = item.status;
                            let barColor = "bg-gray-400";
                            if (item.status === 'CONFIRMED') {
                                statusLabel = 'Confirmados';
                                barColor = 'bg-blue-500';
                            } else if (item.status === 'PENDING') {
                                statusLabel = 'Pendientes / En Curso';
                                barColor = 'bg-yellow-400';
                            } else if (item.status === 'CANCELLED') {
                                statusLabel = 'Cancelados';
                                barColor = 'bg-red-400';
                            } else if (item.status === 'FINISHED') {
                                statusLabel = 'Finalizados';
                                barColor = 'bg-green-600';
                            }

                            return (
                                <div key={item.status}>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm font-medium text-custom-black-800">{statusLabel}</span>
                                        <span className="text-sm text-custom-gray-500">{item.count} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function StatCard({
    title,
    value,
    icon,
    bgColor,
    borderColor,
    children,
    onClick,
    className = "",
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <div
            onClick={onClick}
            className={`p-6 rounded-xl border ${borderColor} ${bgColor} shadow-sm transition-transform hover:-translate-y-1 ${className}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">{icon}</div>
            </div>
            <div>
                <p className="text-sm font-medium text-custom-gray-500 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-extrabold text-custom-black-900 mt-1">{value}</p>
                {children}
            </div>
        </div>
    );
}

function RevenueItem({
    label,
    amount,
    total,
    color,
    icon,
}: {
    label: string;
    amount: number;
    total: number;
    color: string;
    icon: React.ReactNode;
}) {
    const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : "0";
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(val);

    return (
        <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="p-2 bg-white rounded-full shadow-sm mr-4">{icon}</div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-custom-black-800">{label}</span>
                    <span className="font-bold text-custom-black-900">{formatCurrency(amount)}</span>
                </div>
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`absolute top-0 left-0 h-full ${color}`} style={{ width: `${percentage}%` }}></div>
                </div>
                <p className="text-xs text-right text-gray-500 mt-1">{percentage}% del total</p>
            </div>
        </div>
    );
}
