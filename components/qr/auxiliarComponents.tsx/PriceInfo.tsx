"use client";

import { ReservationResponse } from "@/lib/api/reservation/reservation.types";

type Props = {
  reservation: ReservationResponse;
};

const PriceInfo = ({ reservation }: Props) => {
  const { priceDetails, price, paymentMethod } = reservation;
  if (paymentMethod !== "CASH") return null;

  const pricePerBag = 5;
  const extraBagsMatch = reservation.seatCode?.match(/EXTRA_BAGS:(\d+)/);
  const extraBags = extraBagsMatch ? Number(extraBagsMatch[1]) : 0;
  const extrasAmount = extraBags * pricePerBag;
  const IVA = Number(process.env.NEXT_PUBLIC_IVA || 21);
  const ivaAmount = (price * IVA) / 100;
  const totalWithIva = price + ivaAmount;

  return (
    <section className="bg-custom-gray-100 p-4 rounded-lg text-sm flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-custom-gray-600">Precio base:</span>
        <span className="text-custom-black-900 font-medium">
          € {priceDetails.basePrice.toFixed(2).replace(".", ",")}
        </span>
      </div>

      {priceDetails.discounts.length > 0 && (
        <div className="mt-2">
          <p className="font-medium text-custom-black-800 mb-1">
            Descuentos aplicados:
          </p>
          <ul className="list-disc list-inside text-custom-gray-700">
            {priceDetails.discounts.map((discount, idx) => (
              <li key={idx}>
                {discount.description}: -€
                {discount.amount.toFixed(2).replace(".", ",")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {extraBags > 0 && (
        <div className="mt-2">
          <p className="font-medium text-custom-black-800 mb-1">Equipaje adicional</p>
          <div className="flex justify-between items-center text-custom-gray-700">
            <span>
              Maletas adicionales ({extraBags} x € {pricePerBag.toFixed(2).replace(".", ",")}):
            </span>
            <span>€ {extrasAmount.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      )}

      <hr className="border-t border-custom-gray-300 my-2" />

      <div className="flex justify-between items-center">
        <span className="text-custom-gray-600">IVA ({IVA}%):</span>
        <span className="text-custom-black-900 font-medium">
          € {ivaAmount.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-custom-gray-700">Total con IVA:</span>
        <span className="text-lg font-bold text-custom-black-900">
          € {totalWithIva.toFixed(2).replace(".", ",")}
        </span>
      </div>
    </section>
  );
};

export default PriceInfo;
