"use client";

import { useMemo, useState } from "react";
import { MapPin, Truck } from "lucide-react";
import type { Matcher } from "react-day-picker";
import { computeFreeSegments, normalizeBooked, Interval, findSegmentForDate } from "@/lib/client/utils/dateSegment";
import CustomDatePickerVehicle from "@/lib/client/components/CustomDatePickerVehicle";

interface Booking {
    startDate: string; // ISO
    endDate: string; // ISO
}

interface ReservationDetailsProps {
    serviceType: string;
    withdrawLocation: string;
    dateStart?: string; // ISO opcional
    dateEnd?: string; // ISO opcional
    originalTimeZone: string;
    availabilityStart: string; // ISO
    availabilityEnd: string; // ISO
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

    // Interválicos reservados normalizados (para pintar/ bloquear)
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

    // Segmentos libres (lo único seleccionable)
    const freeSegments = useMemo(() => computeFreeSegments(availability, bookedIntervals), [availability, bookedIntervals]);

    // Opciones de horas disponibles
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

    // Estado local de selección
    const [pickStart, setPickStart] = useState<Date | undefined>(dateStart ? new Date(dateStart) : undefined);
    const [pickEnd, setPickEnd] = useState<Date | undefined>(dateEnd ? new Date(dateEnd) : undefined);

    // Disabled global: fuera de disponibilidad + reservas
    const baseDisabled: Matcher[] = useMemo(() => {
        const out: Matcher[] = [
            { before: availability.from },
            { after: availability.to },
            ...bookedIntervals.map((b) => ({ from: b.from, to: b.to })),
        ];
        return out;
    }, [availability, bookedIntervals]);

    // Para la entrega, además de lo anterior, limitamos al segmento libre de pickStart
    const disabledForEnd: Matcher[] = useMemo(() => {
        const rules: Matcher[] = [...baseDisabled];
        if (pickStart) {
            const seg = findSegmentForDate(pickStart, freeSegments);
            if (seg) {
                // Entrega no puede ser antes del inicio
                rules.push({ before: startOfDay(pickStart) });
                // Entrega no puede exceder su segmento libre
                rules.push({ after: seg.to });
            } else {
                // Si por algún motivo el inicio no cae en un segmento válido, bloqueamos todo
                rules.push({ from: availability.from, to: availability.to });
            }
        }
        return rules;
    }, [baseDisabled, pickStart, freeSegments, availability.from, availability.to]);

    // Handlers
    const handleSelectStart = (d: Date) => {
        // Solo permitir si cae dentro de un segmento libre
        const seg = findSegmentForDate(d, freeSegments);
        if (!seg) {
            return;
        }

        const dateWithTime = applyTimeToDate(d, pickTime);
        setPickStart(dateWithTime);

        // Si la entrega actual no está dentro del mismo segmento o es anterior, la reseteamos
        if (!pickEnd || pickEnd < dateWithTime || !findSegmentForDate(pickEnd, [seg])) {
            setPickEnd(undefined);
            onChangeEnd?.(undefined);
        } else {
            // Sincronizar la hora de entrega también
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

        // Validar que la entrega está en el mismo segmento y no antes del inicio
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
        <article className="flex flex-col md:flex-row gap-4 w-full md:h-[17rem] m-1 p-6 border rounded-md border-custom-gray-300 shadow-sm flex-wrap">
            <h3 className="text-custom-gray-800 font-bold text-2xl w-full">Detalles de tu Reserva</h3>

            {/* <div className="flex gap-2 items-center w-full md:w-[45%]">
                <Calendar className="size-6 text-custom-golden-600" />
                <p className="text-custom-gray-600 text-lg flex flex-col">
                    <span>Recodiga:</span>
                    {dateStart ? convertUTCToLocalDate(dateStart, originalTimeZone) : "—"}
                </p>
            </div>
            <div className="flex gap-2 items-center w-full md:w-[45%]">
                <Calendar className="size-6 text-custom-golden-600" />
                <p className="text-custom-gray-600 text-lg flex flex-col">{dateEnd ? convertUTCToLocalDate(dateEnd, originalTimeZone) : "—"}</p>
            </div> */}

            {/* Recogida */}
            <div className="flex gap-2 items-center w-full md:w-[45%]">
                <div className="flex-1">
                    <p className="text-custom-gray-600 text-lg flex flex-col mb-1">
                        <span>Recogida:</span>
                    </p>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <CustomDatePickerVehicle
                                value={pickStart}
                                onSelect={handleSelectStart}
                                placeholder="Fecha de recogida"
                                disabled={baseDisabled}
                                fromDate={availability.from}
                                toDate={availability.to}
                            />
                        </div>
                        <select
                            value={pickTime}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="border border-custom-gray-300 rounded-lg px-3 py-2 bg-custom-white-100 text-custom-gray-800 shadow-sm focus:ring-1 focus:ring-custom-golden-600 outline-none cursor-pointer"
                        >
                            {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Entrega */}
            <div className="flex gap-2 items-center w-full md:w-[45%]">
                <div className="flex-1">
                    <p className="text-custom-gray-600 text-lg flex flex-col mb-1">
                        <span>Entrega:</span>
                    </p>
                    <CustomDatePickerVehicle
                        value={pickEnd}
                        onSelect={handleSelectEnd}
                        placeholder="Fecha de entrega"
                        disabled={disabledForEnd}
                        fromDate={availability.from}
                        toDate={availability.to}
                    />
                    {pickEnd && (
                        <p className="text-sm text-amber-600 mt-2 italic font-medium">
                            * La entrega deberás realizarla también a las {pickTime} hs.
                        </p>
                    )}
                </div>
            </div>

            {/* Ubicación */}
            <div className="flex gap-2 items-center w-full md:w-[45%]">
                <MapPin className="size-6 text-custom-golden-600" />
                <p className="text-custom-gray-600 text-lg flex flex-col">
                    <span>Ubicación:</span>
                    {withdrawLocation}
                </p>
            </div>

            {/* Tipo de servicio */}
            <div className="flex gap-2 items-center w-full md:w-[45%]">
                <Truck className="size-6 text-custom-golden-600" />
                <p className="text-custom-gray-600 text-lg flex flex-col">
                    <span>Tipo de servicio:</span>
                    {serviceType === "WITH_DRIVER" ? "Con conductor" : "Sin conductor"}
                </p>
            </div>

            {/* Vista local opcional */}
            {/* {(pickStart || pickEnd) && (
                <div className="w-full text-sm text-custom-gray-500 mt-2">
                    {pickStart && <div>Recogida (local): {convertUTCToLocalDate(pickStart.toISOString(), originalTimeZone)}</div>}
                    {pickEnd && <div>Entrega (local): {convertUTCToLocalDate(pickEnd.toISOString(), originalTimeZone)}</div>}
                </div>
            )} */}
        </article>
    );
}
