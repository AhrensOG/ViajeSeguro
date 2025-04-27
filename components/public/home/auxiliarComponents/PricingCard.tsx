"use client";

import { PricingCardProps } from "@/lib/api/subscriptions/subscriptions.types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // ✅ solo usamos sonner

const PricingCard = ({ plan, index, isInView, action }: PricingCardProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSession = () => {
        if (status !== "authenticated") {
            router.push("/auth/login");
            return;
        }

        toast.custom((t) => (
            <div className="bg-white rounded-lg shadow-md p-4 w-[300px] border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">¿Confirmás tu elección?</h4>
                <p className="text-sm text-gray-600 mb-4">Serás redirigido a otra página para completar el pago de tu suscripción.</p>
                <div className="flex justify-end gap-2">
                    <button onClick={() => toast.dismiss(t)} className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t);
                            await action(
                                {
                                    userId: session?.user?.id || "",
                                    plan: plan.type,
                                    startDate: new Date(),
                                    endDate:
                                        plan.type === "MONTHLY"
                                            ? new Date(new Date().setMonth(new Date().getMonth() + 1))
                                            : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                                },
                                plan.price || 0
                            );
                        }}
                        className="px-3 py-1 text-sm rounded-md bg-custom-golden-600 text-white hover:bg-custom-golden-700"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView && { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{
                scale: 1.025,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 },
            }}
            className="flex flex-col justify-between items-center bg-custom-white-100 rounded-lg border border-custom-gray-300 shadow-lg overflow-hidden transition-all duration-300"
        >
            <div
                className={`p-5 text-center w-full transition-all duration-300 ${
                    plan.premium ? "bg-custom-golden-600 text-custom-white-100" : "bg-custom-black-900 text-custom-white-100"
                }`}
            >
                <h3 className="text-xl font-bold">{plan.title}</h3>
                {plan.recommended && (
                    <span className="inline-block mt-1 bg-custom-white-100 text-first-g text-custom-golden-600 px-3 py-1 rounded-full text-sm font-bold">
                        {plan.recommended}
                    </span>
                )}
            </div>

            {plan.price && (
                <div className="text-center my-4">
                    <span className="text-3xl font-bold">{plan.price.toFixed(2)} €</span>
                    <span className="text-custom-gray-600"> {plan.subtitle}</span>
                </div>
            )}

            <div className="p-6">
                <ul className="space-y-3">
                    {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-first-gbg-custom-golden-600 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                        </li>
                    ))}
                </ul>

                <motion.button
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`w-full mt-6 transition-all duration-300 ${
                        plan.premium ? "bg-custom-golden-600 hover:bg-custom-golden-700" : "bg-custom-black-900 hover:bg-custom-gray-800"
                    } text-custom-white-100 font-medium py-3 px-6 rounded-lg`}
                    onClick={handleSession}
                >
                    {plan.buttonText}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default PricingCard;
