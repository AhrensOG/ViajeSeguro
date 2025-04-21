"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import PricingCard from "./auxiliarComponents/PricingCard";
import { toast } from "sonner";
import { createSubscription } from "@/lib/api/subscriptions";
import { CreateSubscriptionRequest, CreateSubscriptionPayload } from "@/lib/api/subscriptions/subscriptions.types";
import { createCheckoutSession } from "@/lib/api/stripe";

const pricingOptions = [
    {
        title: "Plan Mensual",
        price: 4.9,
        subtitle: "/mes",
        recommended: "Popular",
        premium: false,
        benefits: [
            "Viajes ilimitados por solo 4,90€/mes",
            "10% de descuento en tu segundo viaje",
            "Acumulá beneficios con tus recomendaciones",
            "Cancelación gratuita hasta 24h antes",
        ],
        buttonText: "Elegir plan mensual",
        type: "MONTHLY",
    },
    {
        title: "Plan Anual",
        price: 49.9,
        subtitle: "/año",
        recommended: "Recomendado",
        premium: true,
        benefits: [
            "Tu asiento a solo 22€ cada vez que viajes",
            "Incluye beneficios exclusivos todo el año",
            "Prioridad en la reserva de plazas",
            "Cancelación gratuita hasta 48h antes",
        ],
        buttonText: "Elegir plan anual",
        type: "ANNUAL",
    },
];

const handleSubscribe = async (data: CreateSubscriptionRequest, amount: number) => {
    const payload: CreateSubscriptionPayload = {
        amount: amount,
        paymentMethod: "STRIPE",
        subscriptionPlan: data.plan,
        type: "SUBSCRIPTION",
        subscriptionId: "",
    };
    try {
        const response = (await createSubscription(data)) as { id: string };
        const stripeData = await createCheckoutSession({
            amount: amount * 100,
            metadata: { ...payload, subscriptionId: response.id },
        });
        if (stripeData.url) {
            window.location.href = stripeData.url;
        } else {
            console.log("Error al crear la sesión de pago:", response);

            toast.info("Error al crear la sesión de pago", {
                description: "Intenta nuevamente o contacta con nuestro soporte",
            });
        }
    } catch (error) {
        console.error("Error al crear la suscripción:", error);
        toast.info("Error al crear la suscripción", { description: "Intenta nuevamente o contacta con nuestro soporte" });
    }
};

const Subscriptions = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.3 });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView && { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            id="precios"
            className="py-24"
        >
            <div className="container mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={isInView && { opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-4xl font-extrabold text-center text-custom-black-900 mb-4"
                >
                    Nuestras Promociones
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={isInView && { opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center text-custom-gray-600 mb-12 max-w-2xl mx-auto"
                >
                    No pagues por trayecto, paga por asiento. El asiento tiene un precio fijo independientemente del destino, y además puedes
                    reducirlo con el sistema de recomendación.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {pricingOptions.map((plan, index) => (
                        <PricingCard key={index} plan={plan} index={index} isInView={isInView} action={handleSubscribe} />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default Subscriptions;
