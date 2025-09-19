import { useState } from "react";
// import { ChevronDown, ChevronUp, Gift, Link } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";
import { useRouter } from "next/navigation";

type Props = {
  reservation: ReservationResponse;
};

const ReservationPriceInfo = ({ reservation }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const { priceDetails } = reservation;
  const router = useRouter();

  // IVA y equipaje adicional
  const ivaFromReservation = (reservation as any)?.IVA;
  const IVA_RATE = ivaFromReservation && Number(ivaFromReservation) > 0
    ? Number(ivaFromReservation) / 100
    : Number(process.env.NEXT_PUBLIC_IVA || 21) / 100;
  const pricePerBag = 5;
  const extraBagsMatch = reservation.seatCode?.match(/EXTRA_BAGS:(\d+)/);
  let extraBags = extraBagsMatch ? Number(extraBagsMatch[1]) : 0;

  // Base después de descuentos (sin IVA)
  const baseFinal = priceDetails?.finalPrice ?? reservation.price;

  // Si no hay seatCode, inferir extras según método de pago
  let inferredExtras = 0;
  if (!extraBagsMatch) {
    // Desde backend guardamos reservation.price SIN IVA y ya con extras incluidos
    inferredExtras = Math.max(0, reservation.price - (priceDetails?.finalPrice ?? baseFinal));
    // Convertir a cantidad de maletas aproximada por si faltara seatCode
    extraBags = Math.max(0, Math.round(inferredExtras / pricePerBag));
  }

  const extras = extraBags * pricePerBag;
  const subtotal = (priceDetails?.finalPrice ?? baseFinal) + extras;
  const ivaAmount = subtotal * IVA_RATE;
  const totalWithIVA = subtotal + ivaAmount;

  return (
    <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4 flex flex-col gap-4">
      {/* Total pagado */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-custom-gray-700 font-medium">
          {reservation.paymentMethod === "CASH" ? "Total a pagar: " : "Total pagado: "}
        </p>
        <p className="text-lg font-bold text-custom-black-900">
          € {totalWithIVA.toFixed(2).replace(".", ",")}
        </p>
      </div>

      {/* Comprar/Agregar equipaje adicional (siempre visible) */}
      <div className="rounded-xl border border-dashed border-custom-gray-300 bg-white p-4 flex flex-col gap-3">
        <p className="text-sm text-custom-gray-700">
          {extraBags > 0 ? (
            <>
              Ya tienes <span className="font-semibold">{extraBags}</span> maleta(s) adicional(es). ¿Quieres agregar más?
            </>
          ) : (
            <>Este viaje incluye 1 equipaje de mano y 1 maleta. ¿Necesitas agregar maletas adicionales?</>
          )}
        </p>
        <div className="flex items-center gap-3">
          <label className="text-sm text-custom-black-800">Maletas a agregar:</label>
          <input
            type="number"
            min={1}
            defaultValue={1}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isFinite(v) || v < 1) e.currentTarget.value = "1";
            }}
            className="w-16 text-center py-1 border border-custom-gray-300 rounded-md"
          />
          <button
            onClick={(e) => {
              const container = (e.currentTarget.parentElement as HTMLElement);
              const input = container.querySelector("input[type='number']") as HTMLInputElement | null;
              const n = input ? Math.max(1, Number(input.value || 1)) : 1;
              router.push(`/purchase?id=${reservation.tripId}&&type=trip&&extraBags=${n}&&extrasOnly=1&&reservationId=${reservation.id}`);
            }}
            className="px-3 py-1.5 rounded-md bg-custom-golden-700 text-white text-sm font-medium hover:bg-custom-golden-800 transition"
          >
            {extraBags > 0 ? "Agregar más (Stripe)" : "Pagar equipaje (Stripe)"}
          </button>
          <span className="text-xs text-custom-gray-600">Precio: € {(pricePerBag).toFixed(2).replace(".", ",")} por maleta</span>
        </div>
      </div>

      {/* Detalle de descuentos */}
      <div className="text-sm text-custom-gray-700">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-custom-golden-700 font-medium hover:underline transition">
          {showDetails ? (
            <>
              <ChevronUp size={16} />
              Ocultar detalle de descuentos
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Ver detalle de descuentos
            </>
          )}
        </button>

        <AnimatePresence initial={false}>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-2 space-y-1 text-custom-gray-700"
            >
              <ul className="space-y-1 border-l border-custom-gray-200 pl-3">
                <li className="flex justify-between">
                  <span className="font-medium">Precio base:</span>
                  <span>€ {priceDetails.basePrice.toFixed(2).replace(".", ",")}</span>
                </li>

                {priceDetails.discounts.map((discount, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>- {discount.description}</span>
                    <span className="text-red-600">– € {discount.amount.toFixed(2).replace(".", ",")}</span>
                  </li>
                ))}

                <li className="flex justify-between pt-1">
                  <span className="font-medium">Total con descuentos:</span>
                  <span>€ {priceDetails.finalPrice.toFixed(2).replace(".", ",")}</span>
                </li>

                <li className="flex justify-between">
                  <span>Equipaje adicional ({extraBags} x € {pricePerBag.toFixed(2).replace(".", ",")}):</span>
                  <span>€ {extras.toFixed(2).replace(".", ",")}</span>
                </li>

                <li className="flex justify-between">
                  <span>IVA ({(IVA_RATE * 100).toFixed(0)}%):</span>
                  <span>€ {ivaAmount.toFixed(2).replace(".", ",")}</span>
                </li>

                <li className="flex justify-between font-semibold text-custom-black-900">
                  <span>Total:</span>
                  <span>€ {totalWithIVA.toFixed(2).replace(".", ",")}</span>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Promo referidos */}
      {/* <div className="flex items-start gap-3 text-sm text-custom-gray-700">
        <Gift className="h-5 w-5 text-custom-golden-700 flex-shrink-0" />
        <div>
          <p>
            ¿Sabías que puedes obtener{" "}
            <strong>descuentos para este viaje</strong> al invitar amigos?
            Comparte tu enlace de referidos y gana beneficios exclusivos.
          </p>
          <button
            className="mt-2 inline-flex items-center gap-1 text-custom-golden-700 font-medium hover:underline transition"
            onClick={() => {
              // Futuro: modal o copiar link
            }}>
            <Link size={14} />
            Compartir con amigos
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default ReservationPriceInfo;
