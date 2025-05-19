"use client";

import {
  Check,
  Clock,
  Gift,
  Shield,
  Star,
  Tag,
  UserPlus,
  X,
} from "lucide-react";
import type React from "react";
import type { JSX } from "react";
import { motion } from "framer-motion";

interface Feature {
  icon: JSX.Element;
  title?: string;
  desc?: string;
  badge?: string;
  points?: string[];
}

interface Plan {
  title: string;
  label: string;
  subtitle: string;
  price: string;
  suffix?: string;
  extraNote?: string;
  button: string;
  highlight?: boolean;
  highlightLabel?: string;
  features: Feature[];
}

const plans: Plan[] = [
  {
    title: "Cliente Preferencial",
    label: "Básico",
    subtitle: "Para empezar a ahorrar",
    price: "GRATIS",
    suffix: "solo por registrarte",
    extraNote: "Sin coste mensual - ideal para nuevos usuarios",
    button: "Registrarme gratis",
    highlight: false,
    features: [
      {
        icon: <Tag size={18} className="mt-1 text-custom-golden-600" />,
        title: "Descuento en cada viaje",
        desc: "Viajes de 27.50€ pasan a valer 24.75€",
        badge: "¡Ahorra 2.75€ por viaje!",
      },
      {
        icon: <Check size={18} className="mt-1 text-custom-golden-600" />,
        desc: "Acceso a todas las rutas disponibles",
      },
      {
        icon: <Check size={18} className="mt-1 text-custom-golden-600" />,
        desc: "Sin compromiso mensual",
      },
    ],
  },
  {
    title: "Club Lealtad",
    label: "Mensual",
    subtitle: "Para viajeros regulares",
    price: "4,90€",
    suffix: "/mes",
    extraNote: "Ahorra más con beneficios mensuales",
    button: "Unirme al Club Lealtad",
    highlight: true,
    highlightLabel: "Popular",
    features: [
      {
        icon: <Tag size={18} className="mt-1 text-custom-golden-600" />,
        title: "Mayor descuento en viajes",
        desc: "Viajes de 27.50€ pasan a valer 22€",
        badge: "¡Ahorra 5.50€ por viaje!",
      },
      {
        icon: <Clock size={18} className="mt-1 text-custom-golden-600" />,
        title: "Cancelaciones flexibles",
        desc: "Hasta 48 horas antes con 100% reembolso",
      },
      {
        icon: <Star size={18} className="mt-1 text-custom-golden-600" />,
        desc: "Estatus de miembro Club Lealtad",
      },
      {
        icon: <Check size={18} className="mt-1 text-custom-golden-600" />,
        desc: "Todos los beneficios del plan básico",
      },
    ],
  },
  {
    title: "Club Fidelidad",
    label: "Anual",
    subtitle: "La experiencia completa",
    price: "49,90€",
    suffix: "/año",
    extraNote: "Solo 4,16€/mes - ¡Ahorra un 15%!",
    button: "Unirme al Club Fidelidad",
    highlight: false,
    features: [
      {
        icon: <Tag size={18} className="mt-1 text-custom-golden-600" />,
        title: "Descuento base en viajes",
        desc: "Viajes de 27.50€ pasan a valer 22€",
        badge: "¡Ahorra hasta 12.10€ por viaje!",
      },
      {
        icon: <UserPlus size={18} className="mt-1 text-custom-golden-600" />,
        title: "Sistema de recomendaciones",
        desc: "Recomienda hasta 3 amigos por mes:",
        points: [
          "1 amigo: viaje a 19,80€ (ahorro de 7,70€)",
          "2 amigos: viaje a 17,60€ (ahorro de 9,90€)",
          "3 amigos: viaje a 15,40€ (ahorro de 12,10€)",
        ],
      },
      {
        icon: <Clock size={18} className="mt-1 text-custom-golden-600" />,
        title: "Cancelaciones ultra flexibles",
        desc: "Hasta 24 horas antes con 100% reembolso",
      },
      {
        icon: <Shield size={18} className="mt-1 text-custom-golden-600" />,
        title: "Selección de asientos",
        desc: "Elige tu asiento preferido en cada viaje",
      },
      {
        icon: <Gift size={18} className="mt-1 text-custom-golden-600" />,
        title: "Beneficios aleatorios",
        desc: "Sorpresas y descuentos exclusivos durante todo el año",
      },
    ],
  },
];

const missingFeatureItems = [
  {
    key: "recommendations",
    icon: <X size={18} className="mt-1 text-custom-gray-400" />,
    title: "Sistema de recomendaciones",
    desc: "Recomienda amigos y obtén descuentos",
  },
  {
    key: "seat-selection",
    icon: <X size={18} className="mt-1 text-custom-gray-400" />,
    title: "Selección de asientos",
    desc: "Elige tu asiento preferido",
  },
  {
    key: "exclusive-benefits",
    icon: <X size={18} className="mt-1 text-custom-gray-400" />,
    title: "Beneficios exclusivos",
    desc: "Sorpresas y ventajas adicionales",
  },
];

const PromotionCards: React.FC = () => {
  const getMissingFeatures = (features: Feature[], index: number) => {
    if (index === 2) return null;

    const currentTitles = features.map((f) => f.title?.toLowerCase() || "");
    const isBasic = index === 0;
    const missing: JSX.Element[] = [];

    if (isBasic) {
      const monthly = plans[1].features;
      monthly.forEach((f) => {
        if (
          f.title &&
          !currentTitles.includes(f.title.toLowerCase()) &&
          f.title !== "Mayor descuento en viajes"
        ) {
          missing.push(
            <div
              key={`missing-${f.title}`}
              className="flex items-start gap-3 opacity-50">
              <X size={18} className="mt-1 text-custom-gray-400" />
              <div>
                <p className="font-medium text-custom-gray-400">{f.title}</p>
                {f.desc && <p className="text-custom-gray-400">{f.desc}</p>}
              </div>
            </div>
          );
        }
      });
    }

    missingFeatureItems.forEach((item) => {
      missing.push(
        <div
          key={`missing-${item.key}`}
          className="flex items-start gap-3 opacity-50">
          {item.icon}
          <div>
            <p className="font-medium text-custom-gray-400">{item.title}</p>
            <p className="text-custom-gray-400">{item.desc}</p>
          </div>
        </div>
      );
    });

    return missing;
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {plans.map((plan, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          viewport={{ once: true, amount: 0.3 }}
          className={`relative bg-custom-white-100 border flex flex-col transition-shadow rounded-xl overflow-hidden ${
            plan.highlight
              ? "border-custom-golden-500 shadow-md hover:shadow-lg"
              : "border-custom-gray-300 shadow-sm hover:shadow-md"
          }`}>
          {plan.highlight && (
            <div className="absolute top-0 right-0 bg-custom-golden-600 text-custom-white-100 px-4 py-1 text-sm font-medium rounded-bl-xl">
              {plan.highlightLabel}
            </div>
          )}

          <div className="p-6 pb-4">
            <span className="w-fit mb-2 inline-block bg-custom-golden-100 text-custom-golden-700 border border-custom-golden-500 rounded-full px-3 py-1 text-sm font-medium">
              {plan.label}
            </span>
            <h3 className="text-2xl font-bold">{plan.title}</h3>
            <p className="text-custom-gray-600">{plan.subtitle}</p>
            <div className="mt-4">
              <span className="text-4xl font-bold text-custom-black-800">
                {plan.price}
              </span>
              {plan.suffix && (
                <span className="text-custom-gray-600 ml-2">{plan.suffix}</span>
              )}
              <div
                className={`${
                  plan.extraNote ? "text-custom-golden-700" : "text-transparent"
                } text-sm font-medium mt-1`}>
                {plan.extraNote ? plan.extraNote : "-"}
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-6 border-t border-b border-custom-gray-200 flex-grow">
            <div className="space-y-4">
              {plan.features.map((f, j) => (
                <div
                  key={j}
                  className="flex items-start gap-3 text-custom-gray-600">
                  {f.icon}
                  <div>
                    {f.title && (
                      <p className="font-medium text-custom-black-800">
                        {f.title}
                      </p>
                    )}
                    {f.desc && <p>{f.desc}</p>}
                    {f.badge && (
                      <p className="text-sm mt-1 bg-custom-golden-100 text-custom-golden-700 px-2 py-1 rounded-md inline-block">
                        {f.badge}
                      </p>
                    )}
                    {f.points && (
                      <ul className="text-sm mt-1 space-y-1">
                        {f.points.map((point, k) => (
                          <li key={k} className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-custom-golden-600" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
              {getMissingFeatures(plan.features, i)}
            </div>
          </div>

          <div className="p-6 pt-6 mt-auto">
            <button className="w-full bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 py-3 rounded-md font-semibold">
              {plan.button}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PromotionCards;
