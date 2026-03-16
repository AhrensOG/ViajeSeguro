
"use client";

import React, { useEffect, useState } from "react";
import { fetchAdminStats, fetchReferralStats, fetchSubscriptionStats, DashboardStats, ReferralStats, SubscriptionStats } from "@/lib/api/admin/stats";
import { Users, Coins, Map, Star, CreditCard, Banknote, Loader2, UserPlus, CheckCircle, XCircle, Clock, Calendar, DollarSign } from "lucide-react";

import { useRouter } from "next/navigation";

/**
 * StatisticsPanel Component
 * Displays a comprehensive dashboard with key metrics for the platform.
 */
export default function StatisticsPanel() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
    const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReferrals, setShowReferrals] = useState(false);
    const [showSubscriptions, setShowSubscriptions] = useState(false);
    const router = useRouter();

    useEffect(() => {
        Promise.all([
            fetchAdminStats(),
            fetchReferralStats(),
            fetchSubscriptionStats()
        ])
            .then(([statsData, referralData, subscriptionData]) => {
                setStats(statsData);
                setReferralStats(referralData);
                setSubscriptionStats(subscriptionData);
            })
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

            {/* Referrals Section */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-custom-black-900 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-custom-golden-600" />
                        Programa de Referidos
                    </h3>
                    <button
                        onClick={() => setShowReferrals(!showReferrals)}
                        className="text-custom-golden-600 font-medium hover:underline"
                    >
                        {showReferrals ? "Ocultar detalles" : "Ver detalles"}
                    </button>
                </div>

                {/* Referral Stats Summary */}
                {referralStats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl border border-custom-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-custom-gray-500">Total Referidos</p>
                                    <p className="text-2xl font-bold text-custom-black-900">{referralStats.stats.totalReferrals}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-custom-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-50 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-custom-gray-500">Pendientes</p>
                                    <p className="text-2xl font-bold text-custom-black-900">{referralStats.stats.pendingRewards}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-custom-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-custom-gray-500">Disponibles</p>
                                    <p className="text-2xl font-bold text-custom-black-900">{referralStats.stats.availableRewards}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-custom-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Star className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-custom-gray-500">Con 1+ Viaje</p>
                                    <p className="text-2xl font-bold text-custom-black-900">{referralStats.stats.referralsWithAtLeastOneTrip}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Referral Details Table */}
                {showReferrals && referralStats && (
                    <div className="bg-white rounded-xl border border-custom-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-custom-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-gray-600 uppercase">Referidor</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-gray-600 uppercase">Referido</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-custom-gray-600 uppercase">Viajes</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-custom-gray-600 uppercase">Alquileres</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-custom-gray-600 uppercase">Estado</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-gray-600 uppercase">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-custom-gray-100">
                                    {referralStats.referrals.map((referral) => (
                                        <tr key={referral.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-custom-black-900">
                                                        {referral.referrer.name} {referral.referrer.lastName}
                                                    </p>
                                                    <p className="text-xs text-custom-gray-500">{referral.referrer.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-custom-black-900">
                                                        {referral.referred.name} {referral.referred.lastName}
                                                    </p>
                                                    <p className="text-xs text-custom-gray-500">{referral.referred.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {referral.referredTripsCount}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {referral.referredBookingsCount}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {referral.rewardStatus === 'PENDING' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        <Clock className="w-3 h-3" /> Pendiente
                                                    </span>
                                                )}
                                                {referral.rewardStatus === 'AVAILABLE' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3" /> Disponible
                                                    </span>
                                                )}
                                                {referral.rewardStatus === 'USED' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        <XCircle className="w-3 h-3" /> Usado
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-custom-gray-500">
                                                {new Date(referral.createdAt).toLocaleDateString('es-ES')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Subscriptions Section */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-custom-black-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-custom-golden-600" />
                        Suscripciones
                    </h3>
                    <button
                        onClick={() => setShowSubscriptions(!showSubscriptions)}
                        className="text-custom-golden-600 font-medium hover:underline"
                    >
                        {showSubscriptions ? "Ocultar detalles" : "Ver detalles"}
                    </button>
                </div>

                {/* Subscription Stats Summary */}
                {subscriptionStats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl border border-custom-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-custom-gray-500">Total Suscripciones</p>
                                    <p className="text-2xl font-bold text-custom-black-900">{subscriptionStats.stats.totalSubscriptions}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-custom-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-custom-gray-500">Activas</p>
                                    <p className="text-2xl font-bold text-custom-black-900">{subscriptionStats.stats.activeSubscriptions}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-custom-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-custom-gray-500">Mensuales</p>
                                    <p className="text-2xl font-bold text-custom-black-900">{subscriptionStats.stats.monthlyPlanCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-custom-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-custom-gray-500">Anuales</p>
                                    <p className="text-2xl font-bold text-custom-black-900">{subscriptionStats.stats.annualPlanCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subscription Details Table */}
                {showSubscriptions && subscriptionStats && (
                    <div className="bg-white rounded-xl border border-custom-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-custom-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-gray-600 uppercase">Usuario</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-custom-gray-600 uppercase">Plan</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-custom-gray-600 uppercase">Estado</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-gray-600 uppercase">Inicio</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-gray-600 uppercase">Fin</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-custom-gray-600 uppercase">Último Pago</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-custom-gray-100">
                                    {subscriptionStats.subscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-custom-black-900">
                                                        {sub.user.name} {sub.user.lastName}
                                                    </p>
                                                    <p className="text-xs text-custom-gray-500">{sub.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {sub.plan === 'MONTHLY' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        Mensual
                                                    </span>
                                                )}
                                                {sub.plan === 'ANNUAL' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Anual
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {sub.status === 'ACTIVE' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3" /> Activa
                                                    </span>
                                                )}
                                                {sub.status === 'INACTIVE' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        <Clock className="w-3 h-3" /> Inactiva
                                                    </span>
                                                )}
                                                {sub.status === 'EXPIRED' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <XCircle className="w-3 h-3" /> Expirada
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-custom-gray-500">
                                                {new Date(sub.startDate).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-custom-gray-500">
                                                {new Date(sub.endDate).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {sub.lastPayment ? (
                                                    <div>
                                                        <p className="font-medium text-custom-black-900">
                                                            {sub.lastPayment.amount.toFixed(2)}€
                                                        </p>
                                                        <p className="text-xs text-custom-gray-500">
                                                            {sub.lastPayment.method} - {new Date(sub.lastPayment.date).toLocaleDateString('es-ES')}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-custom-gray-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
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
