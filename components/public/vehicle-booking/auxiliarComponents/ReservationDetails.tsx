"use client";

import { useMemo, useState } from "react";
import { MapPin, Truck } from "lucide-react";
import type { Matcher } from "react-day-picker";
import { computeFreeSegments, normalizeBooked, Interval, findSegmentForDate } from "@/lib/client/utils/dateSegment";
import CustomDatePickerVehicle from "@/lib/client/components/CustomDatePickerVehicle";

interface Booking {
    startDate: string;
    endDate: string;
}

interface ReservationDetailsProps {
    serviceType: string;
    withdrawLocation: string;
    dateStart?: string;
    dateEnd?: string;
    originalTimeZone: string;
    availabilityStart: string;
    availabilityEnd: string;
    bookings: Booking[];
    onChangeStart?: (date?: Date) => void;
    onChangeEnd?: (date?: Date) => void;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export default function ReservationDetails(props: ReservationDetailsProps) {
    const { serviceType, withdrawLocation, dateStart, dateEnd, availabilityStart, availabilityEnd, bookings, onChangeStart, onChangeEnd } = props;

    const availability: Interval = useMemo(
        () => ({
            from: startOfDay(new Date(availabilityStart)),
            to: endOfDay(new Date(availabilityEnd)),
        }),
        [availabilityStart, availabilityEnd]
    );

    const bookedIntervals: Interval[] = useMemo(
        () =>
            normalizeBooked(
                bookings.map((b) => ({
                    from: new Date(b.startDate),
                    to: new Date(b.endDate),
                })),
                availability
            ),
        [bookings, availability]
    );

    const freeSegments = useMemo(() => computeFreeSegments(availability, bookedIntervals), [availability, bookedIntervals]);

    const timeOptions = useMemo(() => {
        const times = [];
        for (let h = 8; h <= 22; h++) {
            times.push(`${h.toString().padStart(2, "0")}:00`);
            times.push(`${h.toString().padStart(2, "0")}:30`);
        }
        return times;
    }, []);

    const [pickTime, setPickTime] = useState<string>(() => {
        if (dateStart) {
            const d = new Date(dateStart);
            return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
        }
        return "10:00";
    });

    const applyTimeToDate = (date: Date, timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    };

    const [pickStart, setPickStart] = useState<Date | undefined>(dateStart ? new Date(dateStart) : undefined);
    const [pickEnd, setPickEnd] = useState<Date | undefined>(dateEnd ? new Date(dateEnd) : undefined);

    const baseDisabled: Matcher[] = useMemo(() => {
        const out: Matcher[] = [
            { before: availability.from },
            { after: availability.to },
            ...bookedIntervals.map((b) => ({ from: b.from, to: b.to })),
        ];
        return out;
    }, [availability, bookedIntervals]);

    const disabledForEnd: Matcher[] = useMemo(() => {
        const rules: Matcher[] = [...baseDisabled];
        if (pickStart) {
            const seg = findSegmentForDate(pickStart, freeSegments);
            if (seg) {
                rules.push({ before: startOfDay(pickStart) });
                rules.push({ after: seg.to });
            } else {
                rules.push({ from: availability.from, to: availability.to });
            }
        }
        return rules;
    }, [baseDisabled, pickStart, freeSegments, availability.from, availability.to]);

    const handleSelectStart = (d: Date) => {
        const seg = findSegmentForDate(d, freeSegments);
        if (!seg) return;

        const dateWithTime = applyTimeToDate(d, pickTime);
        setPickStart(dateWithTime);

        if (!pickEnd || pickEnd < dateWithTime || !findSegmentForDate(pickEnd, [seg])) {
            setPickEnd(undefined);
            onChangeEnd?.(undefined);
        } else {
            const endWithTime = applyTimeToDate(pickEnd, pickTime);
            setPickEnd(endWithTime);
            onChangeEnd?.(endWithTime);
        }
        onChangeStart?.(dateWithTime);
    };

    const handleSelectEnd = (d: Date) => {
        if (!pickStart) return;
        const seg = findSegmentForDate(pickStart, freeSegments);
        if (!seg) return;

        const dateWithTime = applyTimeToDate(d, pickTime);
        const sameSegment = !!findSegmentForDate(dateWithTime, [seg]);
        const validOrder = dateWithTime >= startOfDay(pickStart);

        if (sameSegment && validOrder) {
            setPickEnd(dateWithTime);
            onChangeEnd?.(dateWithTime);
        }
    };

    const handleTimeChange = (newTime: string) => {
        setPickTime(newTime);
        if (pickStart) {
            const dateWithTime = applyTimeToDate(pickStart, newTime);
            setPickStart(dateWithTime);
            onChangeStart?.(dateWithTime);
        }
        if (pickEnd) {
            const endDateWithTime = applyTimeToDate(pickEnd, newTime);
            setPickEnd(endDateWithTime);
            onChangeEnd?.(endDateWithTime);
        }
    };

    return (
        <article className="w-full p-4 md:p-6 border rounded-lg border-custom-gray-300 shadow-sm bg-white">
            <h3 className="text-custom-gray-800 font-bold text-xl mb-4">Detalles de tu Reserva</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Recogida */}
                <div className="space-y-2">
                    <label className="text-custom-gray-600 text-sm font-medium flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">1</span>
                        Fecha y hora de recogida
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                            <CustomDatePickerVehicle
                                value={pickStart}
                                onSelect={handleSelectStart}
                                placeholder="Fecha"
                                disabled={baseDisabled}
                                fromDate={availability.from}
                                toDate={availability.to}
                            />
                        </div>
                        <select
                            value={pickTime}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="sm:w-24 border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer"
                        >
                            {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Entrega */}
                <div className="space-y-2">
                    <label className="text-custom-gray-600 text-sm font-medium flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">2</span>
                        Fecha y hora de entrega
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 items-start">
                        <div className="flex-1">
                            <CustomDatePickerVehicle
                                value={pickEnd}
                                onSelect={handleSelectEnd}
                                placeholder="Fecha"
                                disabled={disabledForEnd}
                                fromDate={availability.from}
                                toDate={availability.to}
                            />
                        </div>
                        {pickEnd && (
                            <div className="sm:w-24 px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm text-center">
                                {pickTime}
                            </div>
                        )}
                    </div>
                    {pickEnd && (
                        <p className="text-xs text-amber-600 italic">
                            * La entrega deberás realizarla también a las {pickTime} hs.
                        </p>
                    )}
                </div>

                {/* Ubicación */}
                <div className="space-y-2">
                    <label className="text-custom-gray-600 text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        Ubicación de recogida
                    </label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                        {withdrawLocation}
                    </div>
                </div>

                {/* Tipo de servicio */}
                <div className="space-y-2">
                    <label className="text-custom-gray-600 text-sm font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4 text-amber-600" />
                        Tipo de servicio
                    </label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                        {serviceType === "WITH_DRIVER" ? "Con conductor" : "Sin conductor"}
                    </div>
                </div>
            </div>
        </article>
    );
}
