"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MessageSquare, Send } from "lucide-react";

const schema = yup.object().shape({
    name: yup.string().required("El nombre es obligatorio"),
    email: yup.string().email("Email inválido").required("El email es obligatorio"),
    phone: yup.string(),
    message: yup.string().required("El mensaje es obligatorio"),
});

type ContactFormData = {
    name: string;
    email: string;
    phone?: string;
    message: string;
};

const ContactForm = () => {
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: ContactFormData) => {
        // Aquí iría la lógica de envío real
        console.log("Enviado:", data);
        setIsSubmitted(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-custom-white-100 rounded-xl shadow-md p-8 border border-custom-gray-300"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-custom-golden-100 p-2 rounded-full">
                    <MessageSquare className="h-6 w-6 text-custom-golden-700" />
                </div>
                <h2 className="text-2xl font-bold text-custom-black-800">Escríbenos</h2>
            </div>

            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-custom-gray-800 mb-1 font-medium">Nombre completo</label>
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="Tu nombre"
                                className="block w-full border border-custom-gray-300 rounded-md px-4 py-2 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-custom-gray-800 mb-1 font-medium">Correo electrónico</label>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="tu@email.com"
                                className="block w-full border border-custom-gray-300 rounded-md px-4 py-2 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-custom-gray-800 mb-1 font-medium">Teléfono</label>
                            <input
                                type="tel"
                                {...register("phone")}
                                placeholder="Tu número de teléfono"
                                className="block w-full border border-custom-gray-300 rounded-md px-4 py-2 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                            />
                        </div>

                        <div>
                            <label className="block text-custom-gray-800 mb-1 font-medium">Mensaje</label>
                            <textarea
                                {...register("message")}
                                placeholder="¿En qué podemos ayudarte?"
                                rows={5}
                                className="block w-full border border-custom-gray-300 rounded-md px-4 py-2 outline-none focus:border-custom-golden-600 focus:ring-1 focus:ring-custom-golden-100"
                            />
                            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-custom-golden-600 hover:bg-custom-golden-700 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2"
                        >
                            Enviar mensaje <Send className="h-5 w-5" />
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="text-center py-8"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="bg-custom-golden-100 p-4 rounded-full">
                                <CheckCircle className="h-12 w-12 text-custom-golden-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-custom-black-800 mb-3">¡Mensaje enviado!</h3>
                        <p className="text-custom-gray-600 mb-6">Gracias por contactarnos. Te responderemos lo antes posible.</p>
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                reset();
                            }}
                            className="bg-custom-golden-600 hover:bg-custom-golden-700 text-white px-6 py-2 rounded-md"
                        >
                            Enviar otro mensaje
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ContactForm;
