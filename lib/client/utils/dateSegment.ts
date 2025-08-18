export type Interval = { from: Date; to: Date };

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

// Une reservas que se tocan/solapan y las recorta a la disponibilidad
export function normalizeBooked(bookings: Interval[], availability: Interval): Interval[] {
    const A = { from: startOfDay(availability.from), to: endOfDay(availability.to) };
    const inside = bookings
        .map((b) => ({
            from: startOfDay(new Date(b.from)),
            to: endOfDay(new Date(b.to)),
        }))
        // recorte a disponibilidad
        .map((b) => ({
            from: b.from < A.from ? A.from : b.from,
            to: b.to > A.to ? A.to : b.to,
        }))
        // fuera de rango => filtrar
        .filter((b) => b.from <= b.to)
        // ordenar
        .sort((x, y) => x.from.getTime() - y.from.getTime());

    // merge
    const merged: Interval[] = [];
    for (const cur of inside) {
        if (!merged.length) {
            merged.push(cur);
            continue;
        }
        const last = merged[merged.length - 1];
        if (cur.from <= last.to) {
            // solapa o toca -> unir
            last.to = new Date(Math.max(last.to.getTime(), cur.to.getTime()));
        } else {
            merged.push(cur);
        }
    }
    return merged;
}

// Gaps libres entre reservas dentro de la disponibilidad
export function computeFreeSegments(availability: Interval, booked: Interval[]): Interval[] {
    const A = { from: startOfDay(availability.from), to: endOfDay(availability.to) };
    const normalized = normalizeBooked(booked, A);
    const free: Interval[] = [];

    let cursor = A.from;
    for (const b of normalized) {
        if (cursor.getTime() <= b.from.getTime() - 1) {
            free.push({ from: cursor, to: new Date(b.from.getTime() - 1) });
        }
        cursor = new Date(b.to.getTime() + 1);
    }
    if (cursor <= A.to) {
        free.push({ from: cursor, to: A.to });
    }
    return free;
}

export function isInInterval(d: Date, itv: Interval) {
    const x = d.getTime();
    return x >= itv.from.getTime() && x <= itv.to.getTime();
}

export function findSegmentForDate(d: Date, segments: Interval[]) {
    return segments.find((seg) => isInInterval(d, seg));
}
