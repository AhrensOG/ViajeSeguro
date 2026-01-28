"use client";

import { motion } from "framer-motion";
import React, { useRef, useCallback } from "react";
import { toast } from "sonner";
import { createSubscription } from "@/lib/api/subscriptions";
import {
  CreateSubscriptionRequest,
  CreateSubscriptionPayload,
} from "@/lib/api/subscriptions/subscriptions.types";
import { createCheckoutSession } from "@/lib/api/stripe";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Clock, Gift, Tag, X } from "lucide-react";
import type { JSX } from "react";

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
  originalPrice?: string;
}

const plans: Plan[] = [
  {
    title: "Cliente Preferencial",
    label: "Basico",
    subtitle: "Para empezar a ahorrar",
    price: "GRATIS",
    suffix: "(Al registrarte)",
    extraNote: "Sin coste mensual, ideal para nuevos usuarios.",
    button: "Registrarme gratis",
    highlight: false,
    features: [
      {
        icon: (
          <Tag size={18} className="min-w-[18px] mt-1 text-custom-golden-600" />
        ),
        title: "DESCUENTO CADA VEZ QUE VIAJAS",
        points: [
          "A partir del segundo trayecto disfrutaras del descuento como cliente preferente.",
          "Acceso ilimitado a todos los trayectos con vehículos de ViajeSeguro a Barcelona o Madrid desde Valencia o viceversa.",
          "Sin cuotas mensuales.",
        ],
      },
      {
        icon: (
          <Check
            size={18}
            className="min-w-[18px] mt-1 text-custom-golden-600"
          />
        ),
        title: "AHORRA POR RECOMENDAR",
        points: [
          "Busca tu código de cliente preferencial en tu perfil y compártelo con conocidos, amigos o familiares.",
          "Las recomendaciones se acumulan y no caducan.",
          "Las recomendaciones se hacen efectivas en el momento que tus recomendados viajan con nosotros.",
          "Las recomendaciones desaparecen de tu perfil al ser utilizadas.",
          "Acumulando 10 recomendaciones efectivas SIN UTILIZAR tendrás acceso a un trayecto GRATIS con vehículos de ViajeSeguro.",
        ],
      },
      {
        icon: (
          <Clock
            size={18}
            className="min-w-[18px] mt-1 text-custom-golden-600"
          />
        ),
        title: "ANULACIONES ULTRA FLEXIBLES",
        points: [
          "Hasta 24h antes del viaje 100% reembolsable.",
          "Menos de 24h podrás negociar la nueva fecha de tu viaje utilizando nuestro lema “TU VIAJE, NUESTRA PRIORIDAD”",
        ],
      },
    ],
  },
  {
    title: "CLUB DE LEALTAD",
    label: "Mensual",
    subtitle: "Mejoramos tu ahorro",
    price: "4,90€",
    suffix: "/mes",
    extraNote: "ideal para viajeros frecuentes",
    button: "Unirme al Club Lealtad",
    highlight: true,
    highlightLabel: "Popular",
    features: [
      {
        icon: (
          <Tag size={18} className="min-w-[18px] mt-1 text-custom-golden-600" />
        ),
        title: "DESCUENTO CADA VEZ QUE VIAJAS",
        points: [
          "Disfrutaras del descuento como cliente preferente mas descuento por pertenecer a nuestro club exclusivo.",
          "Elige tu asiento exclusivo dentro del vehículo.",
          "Prioridad ante viajeros fuera del club de lealtad en todos los trayectos con vehículos de ViajeSeguro a Barcelona o Madrid desde Valencia o viceversa.",
        ],
      },
      {
        icon: (
          <Gift
            size={18}
            className="min-w-[18px] mt-1 text-custom-golden-600"
          />
        ),
        title: "AHORRA POR RECOMENDAR",
        points: [
          "Permaneciendo en nuestro club participaras en sorteos de UN TRAYECTOS GRATIS todos los meses.",
          "Busca tu código de cliente preferencial en tu perfil y compártelo con conocidos, amigos o familiares.",
          "Las recomendaciones se acumulan y no caducan.",
          "Las recomendaciones se hacen efectivas en el momento que tus recomendados viajan con nosotros.",
          "Las recomendaciones desaparecen de tu perfil al ser utilizadas.",
          "Acumulando 10 recomendaciones efectivas SIN UTILIZAR tendrás acceso a un trayecto GRATIS con vehículos de ViajeSeguro.",
        ],
      },
      {
        icon: (
          <Clock
            size={18}
            className="min-w-[18px] mt-1 text-custom-golden-600"
          />
        ),
        title: "ANULACIONES ULTRA FLEXIBLES",
        points: [
          "Hasta 24h antes del viaje 100% reembolsable.",
          "Menos de 24h podrás negociar la nueva fecha de tu viaje utilizando nuestro lema “TU VIAJE, NUESTRA PRIORIDAD”",
        ],
      },
    ],
  },
  {
    title: "CLUB DE FIDELIDAD",
    label: "Anual",
    subtitle: "TUS VIAJES, NUESTRA PRIORIDAD",
    price: "49,90€",
    suffix: "/año",
    extraNote: "ideal para viajeros FIELES",
    button: "Unirme al Club Fidelidad",
    highlight: false,
    features: [
      {
        icon: (
          <Tag size={18} className="min-w-[18px] mt-1 text-custom-golden-600" />
        ),
        title: "+DESCUENTO CON VIAJESEGURO",
        points: [
          "DOS MESES GRATIS, Ideal para personas que realizan mas de dos trayectos al mes.",
          "Disfrutaras de TODOS NUESTROS DESCUENTOS por pertenecer a nuestro CLUB DE VIAJEROS FIELES.",
          "Elige tu asiento exclusivo dentro del vehículo.",
          "Prioridad ante viajeros incluso los del club de lealtad en todos los trayectos con vehículos de ViajeSeguro a Barcelona o Madrid desde Valencia o viceversa.",
        ],
      },
      {
        icon: (
          <Gift
            size={18}
            className="min-w-[18px] mt-1 text-custom-golden-600"
          />
        ),
        title: "AHORRA POR RECOMENDAR",
        points: [
          "Permaneciendo en nuestro club participaras en sorteos de TRAYECTOS IDA Y REGRESO GRATIS todos los meses.",
          "Busca tu código de cliente preferencial en tu perfil y compártelo con conocidos, amigos o familiares.",
          "Las recomendaciones se acumulan y no caducan.",
          "Las recomendaciones se hacen efectivas en el momento que tus recomendados viajan con nosotros.",
          "Las recomendaciones desaparecen de tu perfil al ser utilizadas.",
          "Acumulando 10 recomendaciones efectivas SIN UTILIZAR tendrás acceso a un trayecto GRATIS con vehículos de ViajeSeguro.",
        ],
      },
      {
        icon: (
          <Clock
            size={18}
            className="min-w-[18px] mt-1 text-custom-golden-600"
          />
        ),
        title: "ANULACIONES ULTRA FLEXIBLES",
        points: [
          "Hasta 24h antes del viaje 100% reembolsable.",
          "Menos de 24h podrás negociar la nueva fecha de tu viaje utilizando nuestro lema “TU VIAJE, NUESTRA PRIORIDAD”",
        ],
      },
    ],
  },
];

const missingFeatureItems = [
  {
    key: "recommendations",
    icon: <X size={18} className="mt-1 text-custom-gray-400" />,
    title: "Sistema de recomendaciones",
    desc: "Recomienda  a tus amigos a viajar con nosotros y obtén mas descuentos. ellos viajan y tu pagas menos",
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

const labelToPlanType = {
  Mensual: "MONTHLY",
  Anual: "ANNUAL",
  Basico: "BASIC",
};

const Subscriptions = () => {
  const ref = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleDirectSubscription = useCallback(
    async (plan: Plan) => {
      const planType =
        labelToPlanType[plan.label as keyof typeof labelToPlanType];
      const now = new Date();
      const endDate = new Date(now);
      if (planType === "ANNUAL") {
        endDate.setFullYear(now.getFullYear() + 1);
      } else if (planType === "MONTHLY") {
        endDate.setMonth(now.getMonth() + 1);
      }
      const requestData: CreateSubscriptionRequest = {
        userId: session?.user?.id || "",
        plan: planType,
        startDate: now,
        endDate,
      };
      const priceValue = parseFloat(plan.price.replace(",", "."));
      try {
        const response = (await createSubscription(requestData)) as {
          id: string;
        };
        const payload: CreateSubscriptionPayload = {
          amount: priceValue,
          paymentMethod: "STRIPE",
          subscriptionPlan: planType,
          type: "SUBSCRIPTION",
          subscriptionId: response.id,
        };
        const stripeData = await createCheckoutSession({
          amount: Math.round(priceValue * 100),
          metadata: payload,
        });
        if (stripeData.url) {
          window.location.href = stripeData.url;
        } else {
          toast.info("No se pudo crear la sesión de pago");
        }
      } catch (error) {
        console.error("Error al crear la suscripción:", error);
        toast.info("Error al procesar la suscripción");
      }
    },
    [session]
  );

  React.useEffect(() => {
    if (session?.user?.id && typeof window !== "undefined") {
      const pendingLabel = localStorage.getItem("pendingPlan");
      if (pendingLabel) {
        const plan = plans.find((p) => p.label === pendingLabel);
        if (plan) {
          handleDirectSubscription(plan);
        }
        localStorage.removeItem("pendingPlan");
      }
    }
  }, [session, handleDirectSubscription]);

  const handleSession = (plan: Plan) => {
    const planType =
      labelToPlanType[plan.label as keyof typeof labelToPlanType];
    if (!session?.user?.id) {
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingPlan", JSON.stringify(plan.label));
      }
      router.push("/auth/login");
      return;
    }
    if (planType === "BASIC") {
      toast.info("Ya estás suscripto a este plan.");
      return;
    }
    handleDirectSubscription(plan);
  };

  const getMissingFeatures = (features: Feature[], index: number) => {
    if (index === 2 || index === 1) return null;

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
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="precios"
      className="py-16 px-4 bg-custom-white-50 text-custom-black-900">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold text-custom-black-800 text-center mb-12">
          Planes para ahorrar en tu viaje compartido
        </motion.h2>
        <p className="text-center text-custom-gray-600 max-w-2xl mx-auto mb-8">
          Únete a uno de nuestros planes y obtén descuentos exclusivos en tus
          viajes compartidos entre Madrid, Barcelona y Valencia. Sin cuotas
          ocultas, sin sorpresas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              className={`relative bg-custom-white-100 border flex flex-col transition-shadow rounded-xl overflow-hidden ${plan.highlight
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
                  <div className="flex flex-col items-baseline gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-custom-black-800">
                        {plan.price}
                      </span>
                      {plan.suffix && (
                        <span className="text-custom-gray-600">
                          {plan.suffix}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      {plan.originalPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg line-through text-custom-gray-500">
                            {plan.originalPrice}
                          </span>
                          <span className="text-custom-gray-600">
                            {plan.suffix}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg line-through text-transparent">
                            {plan.originalPrice}
                          </span>
                          <span className="text-transparent">
                            {plan.suffix}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`${plan.extraNote
                      ? "text-custom-golden-700"
                      : "text-transparent "
                      } text-lg font-medium mt-1`}>
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
                <button
                  onClick={() => handleSession(plan)}
                  className="w-full bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 py-3 rounded-md font-semibold">
                  {plan.button}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Subscriptions;
