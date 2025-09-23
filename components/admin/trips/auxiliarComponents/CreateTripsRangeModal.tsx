import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { getActiveCities } from "@/lib/api/admin/cities";
import { CityResponse } from "@/lib/api/admin/cities/cities.type";
import { createTripsBulk } from "@/lib/api/admin/trips";
import { Driver, TripResponse } from "@/lib/api/admin/trips/trips.type";

interface Props {
  onClose: () => void;
  onSuccess: Dispatch<SetStateAction<TripResponse[]>>;
  drivers: Driver[];
}

const inputClass =
  "w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";
const labelClass = "block text-xs font-semibold text-custom-gray-500 mb-1 uppercase tracking-wide";

type WeekKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export default function CreateTripsRangeModal({ onClose, onSuccess, drivers }: Props) {
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    originalTimeZone: "Europe/Madrid",
    basePrice: "",
    capacity: "",
    minPassengers: "",
    visible: true,
    status: "PENDING" as const,
    originLocation: "",
    destinationLocation: "",
    driverId: "",
    dateStart: "",
    dateEnd: "",
    departureTime: "07:00",
    arrivalTime: "09:00",
    weekdays: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    } as Record<WeekKey, boolean>,
  });

  const selectedDriver = useMemo(() => drivers.find((d) => d.id === form.driverId), [drivers, form.driverId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name } = target;

    if (name.startsWith("weekday:")) {
      const key = name.split(":")[1] as WeekKey;
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, weekdays: { ...prev.weekdays, [key]: checked } }));
      return;
    }

    let parsed: string | boolean = (target as HTMLInputElement).type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : target.value;
    if (name === "basePrice") parsed = String(target.value).replace(/,/g, ".");
    setForm((prev) => ({ ...prev, [name]: parsed }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creando viajes en rango...");

    if (!form.origin || !form.destination || !form.dateStart || !form.dateEnd || !form.driverId) {
      toast.info("Completa origen, destino, rango de fechas y conductor", { id: toastId });
      return;
    }

    try {
      const payload = {
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        originalTimeZone: form.originalTimeZone,
        basePrice: parseFloat(form.basePrice || "0"),
        capacity: form.capacity ? Number(form.capacity) : undefined,
        minPassengers: form.minPassengers ? Number(form.minPassengers) : undefined,
        visible: form.visible,
        status: form.status,
        originLocation: form.originLocation || undefined,
        destinationLocation: form.destinationLocation || undefined,
        driverId: form.driverId,
        dateStart: form.dateStart,
        dateEnd: form.dateEnd,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        weekdays: (Object.entries(form.weekdays)
          .filter(([, v]) => v)
          .map(([k]) => k) as WeekKey[]),
      };

      const created = await createTripsBulk(payload);
      if (Array.isArray(created) && created.length > 0) {
        onSuccess((prev) => [...prev, ...created]);
      }
      toast.success("Viajes creados en el rango", { id: toastId });
      onClose();
    } catch (err) {
      console.error(err);
      toast.info("No se pudieron crear los viajes en rango", { id: toastId });
    }
  };

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cs = await getActiveCities();
        setCities(cs);
      } catch {
        toast.info("Error al cargar las ciudades");
      }
    };
    loadCities();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl p-8 my-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto relative border border-custom-gray-300"
      >
        <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-black" aria-label="Cerrar">
          <X className="size-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-custom-golden-700">Crear viajes por rango de fechas</h2>
        <p className="text-sm text-custom-gray-500 mb-6">Se crearán viajes clonados para cada día seleccionado.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-custom-black-800">
          <div>
            <label className={labelClass}>Conductor</label>
            <select name="driverId" value={form.driverId} onChange={handleChange} className={inputClass} required>
              <option value="">-- Seleccionar --</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.email}
                </option>
              ))}
            </select>
            {selectedDriver && (
              <div className="text-xs mt-2 text-custom-gray-700 bg-custom-gray-100 rounded p-3 border border-custom-gray-200">
                <p className="font-medium text-custom-black-800">
                  {selectedDriver.name} {selectedDriver.lastName}
                </p>
                <p className="text-custom-gray-600">{selectedDriver.email}</p>
              </div>
            )}
          </div>

          <div className="col-span-full">
            <h3 className="text-base font-semibold text-custom-golden-600 mb-1">Ubicación y horario</h3>
            <hr className="mb-4" />
          </div>

          <div>
            <label className={labelClass}>Origen</label>
            <select name="origin" value={form.origin} onChange={handleChange} className={inputClass} required>
              <option value="">-- Seleccionar ciudad de origen --</option>
              {cities.map((city) => (
                <option key={city.id} value={`${city.name}, ${city.state}, ${city.country}`}>
                  {city.name}, {city.state}, {city.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Destino</label>
            <select name="destination" value={form.destination} onChange={handleChange} className={inputClass} required>
              <option value="">-- Seleccionar ciudad de destino --</option>
              {cities.map((city) => (
                <option key={city.id} value={`${city.name}, ${city.state}, ${city.country}`}>
                  {city.name}, {city.state}, {city.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Fecha inicio</label>
            <input name="dateStart" type="date" value={form.dateStart} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Fecha fin</label>
            <input name="dateEnd" type="date" value={form.dateEnd} onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Hora de salida</label>
            <input name="departureTime" type="time" value={form.departureTime} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Hora de llegada</label>
            <input name="arrivalTime" type="time" value={form.arrivalTime} onChange={handleChange} className={inputClass} required />
          </div>

          <div className="col-span-full">
            <h3 className="text-base font-semibold text-custom-golden-600 mb-1">Días de la semana</h3>
            <hr className="mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {([
                ["mon", "Lunes"],
                ["tue", "Martes"],
                ["wed", "Miércoles"],
                ["thu", "Jueves"],
                ["fri", "Viernes"],
                ["sat", "Sábado"],
                ["sun", "Domingo"],
              ] as [WeekKey, string][]).map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 bg-custom-gray-100 px-3 py-2 rounded-md border border-custom-gray-200">
                  <input type="checkbox" name={`weekday:${k}`} checked={form.weekdays[k]} onChange={handleChange} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="col-span-full">
            <h3 className="text-base font-semibold text-custom-golden-600 mb-1">Configuración del viaje</h3>
            <hr className="mb-4" />
          </div>

          <div>
            <label className={labelClass}>Precio base (€)</label>
            <input name="basePrice" type="text" value={form.basePrice} onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Capacidad</label>
            <input name="capacity" type="text" value={form.capacity} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Mín. pasajeros</label>
            <input name="minPassengers" type="text" value={form.minPassengers} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Ubicación exacta de origen</label>
            <input name="originLocation" type="text" value={form.originLocation} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Ubicación exacta de destino</label>
            <input name="destinationLocation" type="text" value={form.destinationLocation} onChange={handleChange} className={inputClass} />
          </div>

          <div className="col-span-full flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-5 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-5 rounded-md"
              disabled={!form.driverId || !form.origin || !form.destination || !form.dateStart || !form.dateEnd}
            >
              Crear viajes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
