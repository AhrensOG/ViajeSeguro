import { useState } from "react";
import { ChevronDown, ChevronUp, Gift, Link } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReservationResponse } from "@/lib/api/reservation/reservation.types";

type Props = {
  reservation: ReservationResponse;
};

const ReservationPriceInfo = ({ reservation }: Props) => {
  const [showDetails, setShowDetails] = useState(false);
  const { priceDetails } = reservation;

  return (
    <div className="rounded-xl border border-custom-gray-200 bg-[#f9fafb] p-4 flex flex-col gap-4">
      {/* Total pagado */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-custom-gray-700 font-medium">
          {reservation.paymentMethod === "CASH"
            ? "Total a pagar: "
            : "Total pagado: "}
        </p>
        <p className="text-lg font-bold text-custom-black-900">
          € {reservation.price.toFixed(2).replace(".", ",")}
        </p>
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
            <motion.ul
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-2 space-y-1 border-l border-custom-gray-200 pl-3 text-custom-gray-700">
              <li>
                <span className="font-medium">Precio base:</span> €{" "}
                {priceDetails.basePrice.toFixed(2).replace(".", ",")}
              </li>
              {priceDetails.discounts.map((discount, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>- {discount.description}</span>
                  <span className="text-red-600">
                    – € {discount.amount.toFixed(2).replace(".", ",")}
                  </span>
                </li>
              ))}
              <li className="pt-1 font-medium text-custom-black-800">
                Total con descuentos: €{" "}
                {priceDetails.finalPrice.toFixed(2).replace(".", ",")}
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Promo referidos */}
      <div className="flex items-start gap-3 text-sm text-custom-gray-700">
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
      </div>
    </div>
  );
};

export default ReservationPriceInfo;
