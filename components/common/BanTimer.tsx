import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface Props {
    bannedUntil?: Date;
    isPermanent?: boolean;
}

const BanTimer = ({ bannedUntil, isPermanent }: Props) => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        if (isPermanent) {
            setTimeLeft(null);
            return;
        }

        if (!bannedUntil) return;

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = new Date(bannedUntil).getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft(null);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [bannedUntil, isPermanent]);

    if (!timeLeft && !isPermanent) {
        return <p className="text-green-600 font-bold">¡El tiempo de baneo ha terminado! Intenta recargar.</p>;
    }

    if (isPermanent) {
        return (
            <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg border border-red-200 mt-4">
                <Clock className="w-10 h-10 text-red-600 mb-2" />
                <h3 className="text-lg font-bold text-red-800 mb-1">Suspensión Permanente</h3>
                <p className="text-sm text-red-700 mb-3 text-center">
                    Tu cuenta ha sido suspendida de forma permanente debido a violaciones graves de nuestras políticas.
                </p>
                <p className="text-xs text-red-500 font-semibold uppercase tracking-wider">
                    Acceso Revocado
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg border border-red-200 mt-4">
            <Clock className="w-10 h-10 text-red-500 mb-2" />
            <h3 className="text-lg font-bold text-red-700 mb-1">Acceso Restringido</h3>
            <p className="text-sm text-red-600 mb-3 text-center">
                Tu cuenta ha sido suspendida temporalmente. Podrás ingresar nuevamente en:
            </p>
            <div className="flex gap-2 text-red-800 font-mono text-xl font-bold">
                <div className="flex flex-col items-center">
                    <span>{timeLeft?.days ?? 0}</span>
                    <span className="text-xs font-normal">días</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft?.hours ?? 0).padStart(2, '0')}</span>
                    <span className="text-xs font-normal">hrs</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft?.minutes ?? 0).padStart(2, '0')}</span>
                    <span className="text-xs font-normal">min</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft?.seconds ?? 0).padStart(2, '0')}</span>
                    <span className="text-xs font-normal">seg</span>
                </div>
            </div>
        </div>
    );
};

export default BanTimer;
