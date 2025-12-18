import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    restrictedUntil: Date;
}

const RestrictionTimer = ({ restrictedUntil }: Props) => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = new Date(restrictedUntil).getTime() - now.getTime();

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
    }, [restrictedUntil]);

    if (!timeLeft) {
        return null; // Don't show if expired (or maybe show "Restriction Ended"?)
    }

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
            <AlertTriangle className="w-10 h-10 text-yellow-500 mb-2" />
            <h3 className="text-lg font-bold text-yellow-700 mb-1">Cuenta Restringida</h3>
            <p className="text-sm text-yellow-600 mb-3 text-center">
                Tu rol ha sido limitado temporalmente. La restricción finalizará en:
            </p>
            <div className="flex gap-2 text-yellow-800 font-mono text-xl font-bold">
                <div className="flex flex-col items-center">
                    <span>{timeLeft.days}</span>
                    <span className="text-xs font-normal">días</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-xs font-normal">hrs</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-xs font-normal">min</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-xs font-normal">seg</span>
                </div>
            </div>
        </div>
    );
};

export default RestrictionTimer;
