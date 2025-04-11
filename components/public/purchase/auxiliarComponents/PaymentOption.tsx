"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type PaymentOptionProps = {
  icon: ReactNode;
  title: string;
  description: string;
  features: ReactNode[];
  highlighted?: boolean;
  recommended?: boolean;
  badgeLabel?: string;
  buttonLabel: string;
  onClick?: () => void;
  secure?: boolean;
};

const PaymentOption = ({
  icon,
  title,
  description,
  features,
  highlighted,
  recommended,
  buttonLabel,
  onClick,
  badgeLabel,
  secure,
}: PaymentOptionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={`${
      highlighted
        ? "border-2 border-custom-golden-500 shadow-md"
        : "border-2 border-custom-gray-300 shadow-md"
    } bg-custom-white-100 relative rounded-md`}>
    {recommended && (
      <div className="absolute top-0 right-0">
        <div className="rounded-bl-md bg-custom-golden-600 text-white border-0 px-3 py-1">
          {badgeLabel ?? "Recomendado"}
        </div>
      </div>
    )}

    <div className="p-6 pt-8">
      <div className="flex items-start gap-4">
        <div className="bg-custom-gray-100 p-3 rounded-full hidden sm:block">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-custom-black-800 mb-1">
            {title}
          </h3>
          <p className="text-custom-gray-600 mb-4">{description}</p>

          <div className="space-y-3 mb-4">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-custom-gray-800">
                {f}
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse items-center justify-center sm:flex-row sm:justify-between gap-2 w-full mt-6">
            {secure && (
              <span className="text-sm text-custom-gray-600">
                Pago 100% seguro
              </span>
            )}
            <button
              className={`rounded-md px-6 py-2 font-medium transition cursor-pointer ${
                highlighted
                  ? "bg-custom-golden-600 hover:bg-custom-golden-700 text-white"
                  : "border border-custom-gray-300 text-custom-gray-800 hover:bg-custom-gray-100"
              }`}
              onClick={onClick}>
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default PaymentOption;
