import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";
import { CreateReservationFormData, TripOption, UserOption, ReservationResponse } from "@/lib/api/admin/reservation/reservation.types";
import { toast } from "sonner";
import { createReservation, searchUsers, searchTripsByDate } from "@/lib/api/admin/reservation/intex";

interface Props {
    onClose: () => void;
    onSuccess: Dispatch<SetStateAction<ReservationResponse[]>>;
}

type FormState = {
    userId: string;
    tripId: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    paymentMethod: "STRIPE" | "CASH";
    seatCode?: string;
};

const CreateReservationModal = ({ onClose, onSuccess }: Props) => {
    const [form, setForm] = useState<FormState>({
        userId: "",
        tripId: "",
        status: "PENDING",
        paymentMethod: "STRIPE",
        seatCode: "",
    });

    const [isCourtesy, setIsCourtesy] = useState(false);
    const [customPrice, setCustomPrice] = useState<string>("");

    // --- User Autocomplete State ---
    const [userSearchTerm, setUserSearchTerm] = useState("");
    const [userOptions, setUserOptions] = useState<UserOption[]>([]);
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);
    const [showUserResults, setShowUserResults] = useState(false);
    const userWrapperRef = useRef<HTMLDivElement>(null);

    // --- Trip Autocomplete State ---
    const [tripDate, setTripDate] = useState("");
    const [tripOptions, setTripOptions] = useState<TripOption[]>([]);
    const [isLoadingTrips, setIsLoadingTrips] = useState(false);
    const [showTripResults, setShowTripResults] = useState(false); // Can be used to toggle list visibility if needed, or just show when date selected
    const tripWrapperRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userWrapperRef.current && !userWrapperRef.current.contains(event.target as Node)) {
                setShowUserResults(false);
            }
            // For trips, we might want to keep it open or not, usually closing is good UX if clicking outside
            if (tripWrapperRef.current && !tripWrapperRef.current.contains(event.target as Node)) {
                setShowTripResults(false); // Optional: close trip list if clicking away
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce User Search
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (userSearchTerm.trim().length >= 2) {
                setIsSearchingUsers(true);
                setShowUserResults(true); // Open results when searching
                try {
                    const results = await searchUsers(userSearchTerm);
                    setUserOptions(results as UserOption[]);
                } catch (error) {
                    console.error("Error searching users:", error);
                } finally {
                    setIsSearchingUsers(false);
                }
            } else {
                setUserOptions([]);
                // setShowUserResults(false); // Keep open if focused? Or close if empty? Better close if empty.
            }
        }, 300); // Faster debounce for typing
        return () => clearTimeout(timeoutId);
    }, [userSearchTerm]);

    // Trip Search by Date
    useEffect(() => {
        if (tripDate) {
            const fetchTrips = async () => {
                setIsLoadingTrips(true);
                setShowTripResults(true); // Show results when date changes
                try {
                    const results = await searchTripsByDate(tripDate);
                    setTripOptions(results);
                } catch (error) {
                    console.error("Error searching trips:", error);
                    toast.error("Error al buscar viajes");
                } finally {
                    setIsLoadingTrips(false);
                }
            };
            fetchTrips();
        } else {
            setTripOptions([]);
            setShowTripResults(false);
        }
    }, [tripDate]);

    const formatDate = (str: string): string => {
        const dateObj = new Date(str);
        if (isNaN(dateObj.getTime())) return "Fecha inválida";
        return dateObj.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleSelectUser = (user: UserOption) => {
        setForm({ ...form, userId: user.id });
        setUserSearchTerm(`${user.name} ${user.lastName} (${user.email})`); // Show selected value
        setShowUserResults(false);
    };

    const handleSelectTrip = (trip: TripOption) => {
        setForm({ ...form, tripId: trip.id });
        // Optional: Maybe show selected trip info somewhere else or keep date and highlight selection?
        // User asked "que aparezcan todos los viajes con esa fecha". 
        // We can keep the list visible but highlight the selected one, or close it and show selection text.
        // Let's close and maybe show a summary below the date input? Or just highlight in list?
        // Let's hide list and show a "Selected Trip" box.
        // Or simpler: Keep list open? No. 
        // Let's set a visual indicator.
        setShowTripResults(false); // Close list for now
    };

    // Helper to get selected trip label
    const selectedTrip = tripOptions.find(t => t.id === form.tripId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const onSubmit = async (data: CreateReservationFormData) => {
        try {
            const res = await createReservation(data, form.userId);
            toast.success("Reserva creada con éxito");
            onSuccess((prev) => [...prev, res as ReservationResponse]);
            onClose();
        } catch (error) {
            console.error(error);
            return toast.info(
                error instanceof Error
                    ? error.message === "Trip is already full"
                        ? "Viaje lleno"
                        : "Error al crear la reserva"
                    : "Error al crear la reserva"
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.userId) return toast.warning("Seleccione un usuario");
        if (!form.tripId) return toast.warning("Seleccione un viaje");

        // Calcular el precio a enviar
        let finalPrice: number | undefined = undefined;

        if (isCourtesy) {
            finalPrice = 0;
        } else if (customPrice !== "") {
            finalPrice = parseFloat(customPrice);
            if (isNaN(finalPrice)) {
                return toast.warning("El precio personalizado debe ser un número válido");
            }
        }

        onSubmit({
            tripId: form.tripId,
            status: form.status,
            paymentMethod: form.paymentMethod,
            seatCode: form.seatCode || undefined,
            price: finalPrice, // Enviamos el precio si existe
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-70 flex justify-center items-center z-50">
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative border border-custom-gray-300 max-h-[90vh] overflow-y-auto"
            >
                <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-black" aria-label="Cerrar">
                    <X className="size-5" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-custom-golden-700">Crear nueva reserva</h2>

                <form onSubmit={handleSubmit} className="space-y-4 text-sm text-custom-black-800">

                    {/* BUSCAR USUARIO */}
                    <div ref={userWrapperRef} className="relative">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Buscar Usuario</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full border border-custom-gray-300 rounded-md px-4 py-2 pr-10 focus:border-custom-golden-500 focus:outline-none"
                                placeholder="Nombre o Email..."
                                value={userSearchTerm}
                                onChange={(e) => {
                                    setUserSearchTerm(e.target.value);
                                    if (form.userId) setForm({ ...form, userId: '' }); // Reset selection on type
                                    setShowUserResults(true);
                                }}
                                onFocus={() => userOptions.length > 0 && setShowUserResults(true)}
                            />
                            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>

                        {/* RESULTADOS USUARIOS */}
                        {showUserResults && (userSearchTerm.length >= 2 || userOptions.length > 0) && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-custom-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {isSearchingUsers ? (
                                    <p className="px-4 py-2 text-gray-500 text-xs">Buscando...</p>
                                ) : userOptions.length === 0 ? (
                                    <p className="px-4 py-2 text-gray-500 text-xs">No se encontraron usuarios.</p>
                                ) : (
                                    userOptions.map((u) => (
                                        <div
                                            key={u.id}
                                            className="px-4 py-3 hover:bg-custom-golden-50 cursor-pointer border-b border-gray-50 last:border-0"
                                            onClick={() => handleSelectUser(u)}
                                        >
                                            <p className="font-medium text-custom-black-800">{u.name} {u.lastName}</p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* BUSCAR VIAJE */}
                    <div ref={tripWrapperRef} className="relative pt-2">
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Buscar Viaje por Fecha</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={tripDate}
                                onChange={(e) => setTripDate(e.target.value)}
                                className="w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:border-custom-golden-500 focus:outline-none"
                                onClick={() => setShowTripResults(true)} // Re-open list if date already selected
                            />
                            {/* <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" /> */}
                        </div>

                        {/* Trip Selection Summary (if selected and list closed) */}
                        {form.tripId && !showTripResults && selectedTrip && (
                            <div className="mt-2 p-2 bg-custom-golden-50 border border-custom-golden-200 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-custom-golden-800">{selectedTrip.origin} - {selectedTrip.destination}</p>
                                    <p className="text-xs text-custom-golden-700">Salida: {formatDate(selectedTrip.departure)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setForm({ ...form, tripId: '' }); setShowTripResults(true); }}
                                    className="text-xs text-custom-golden-600 underline"
                                >
                                    Cambiar
                                </button>
                            </div>
                        )}

                        {/* RESULTADOS VIAJES (LISTA ABAJO) */}
                        {showTripResults && tripDate && (
                            <div className={tripOptions.length > 5 ? "mt-2 max-h-60 overflow-y-auto border border-custom-gray-200 rounded-md shadow-sm" : "mt-2"}>
                                {isLoadingTrips ? (
                                    <p className="px-2 py-2 text-gray-500 text-xs text-center">Cargando viajes...</p>
                                ) : tripOptions.length === 0 ? (
                                    <p className="px-2 py-2 text-orange-500 text-xs text-center border border-orange-100 bg-orange-50 rounded-md">No hay viajes programados para esta fecha.</p>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-gray-500 px-1">Selecciona un viaje:</p>
                                        {tripOptions.map((t) => (
                                            <div
                                                key={t.id}
                                                className={`p-3 rounded-md border cursor-pointer hover:shadow-md transition-all ${form.tripId === t.id
                                                    ? "bg-custom-golden-50 border-custom-golden-400 ring-1 ring-custom-golden-400"
                                                    : "bg-white border-custom-gray-200 hover:border-custom-golden-300"
                                                    }`}
                                                onClick={() => handleSelectTrip(t)}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-lg font-bold text-gray-800">{formatDate(t.departure)}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {t.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm font-medium text-gray-700">
                                                    {t.origin} <span className="mx-2 text-gray-400">➝</span> {t.destination}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* PRECIO / CORTESÍA */}
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="courtesy"
                                checked={isCourtesy}
                                onChange={(e) => {
                                    setIsCourtesy(e.target.checked);
                                    if (e.target.checked) setCustomPrice(""); // Limpiar custom price si es cortesía
                                }}
                                className="h-4 w-4 text-custom-golden-600 focus:ring-custom-golden-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="courtesy" className="text-sm font-medium text-custom-black-800 cursor-pointer">
                                Viaje de Cortesía (Gratis)
                            </label>
                        </div>

                        {!isCourtesy && (
                            <div>
                                <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Precio Personalizado (Opcional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-400">€</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full border border-custom-gray-300 rounded-md pl-8 py-2 focus:border-custom-golden-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                        placeholder="Dejar vacío para automático"
                                        value={customPrice}
                                        onChange={(e) => setCustomPrice(e.target.value)}
                                        disabled={isCourtesy}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Si se deja vacío, se calculará el precio estándar del viaje.</p>
                            </div>
                        )}
                    </div>

                    {/* {(["seatCode", "discountId"] as const).map((name) => (
                        <div key={name}>
                            <label className="block text-xs font-semibold text-custom-gray-500 mb-1">
                                {name === "seatCode" ? "Código de asiento (opcional)" : "ID de descuento (opcional)"}
                            </label>
                            <input
                                name={name}
                                type="text"
                                value={form[name] ?? ""}
                                onChange={handleChange}
                                className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                            />
                        </div>
                    ))} */}

                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Estado</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            {["PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-custom-gray-500 mb-1">Método de pago</label>
                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className="w-full border border-custom-gray-300 rounded-md px-4 py-2"
                        >
                            {["STRIPE", "CASH", "OTHER"].map((method) => (
                                <option key={method} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer border border-custom-gray-300 text-custom-black-800 hover:bg-custom-gray-100 font-medium py-2 px-4 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReservationModal;
