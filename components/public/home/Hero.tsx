"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import Image from "next/image";
import CustomSelect from "./auxiliarComponents/CustomSelect";
import CustomDatePicker from "./auxiliarComponents/CustomDatePicker";
import { formatDateToDDMMYYYY } from "@/lib/functions";

const Hero = () => {
    const [origen, setOrigen] = useState<string>("");
    const [destino, setDestino] = useState<string>("");
    const [fecha, setFecha] = useState<Date | null>(null);

    return (
        <section className="relative bg-[url('/main/main.webp')] bg-cover bg-no-repeat sm:bg-repeat sm:bg-auto bg-bottom py-16">
            <div className="w-full mx-auto px-4 text-center text-custom-white-100">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-3xl md:text-5xl font-extrabold mb-4"
                >
                    Transporte Privado Confiable
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="text-xl mb-8 font-bold max-w-2xl mx-auto"
                >
                    Ofrecemos un servicio de transporte entre Valencia,
                    Barcelona y Madrid, cómodo y flexible para ti.
                </motion.p>

                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <Image
                            src="/main/main.webp"
                            alt="Ilustración de coches en carretera"
                            fill
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                            delay: 0.3,
                        }}
                        className="bg-custom-white-100 rounded-lg shadow-lg p-6 mt-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <CustomSelect
                                    options={[
                                        {
                                            value: "valencia",
                                            label: "Valencia",
                                        },
                                        { value: "madrid", label: "Madrid" },
                                        {
                                            value: "barcelona",
                                            label: "Barcelona",
                                        },
                                    ]}
                                    placeholder="Origen"
                                    onSelect={setOrigen}
                                    icon={
                                        <MapPin className="h-5 w-5 text-custom-gray-500" />
                                    }
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <CustomSelect
                                    options={[
                                        {
                                            value: "valencia",
                                            label: "Valencia",
                                        },
                                        { value: "madrid", label: "Madrid" },
                                        {
                                            value: "barcelona",
                                            label: "Barcelona",
                                        },
                                    ]}
                                    placeholder="Destino"
                                    onSelect={setDestino}
                                    icon={
                                        <MapPin className="h-5 w-5 text-custom-gray-500" />
                                    }
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <CustomDatePicker onSelect={setFecha} />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="flex gap-2"
                            >
                                <div className="flex items-center gap-3 border border-custom-gray-300 rounded-lg p-3 bg-custom-white-100 hover:">
                                    <Users className="h-5 w-5 text-custom-gray-500" />
                                    <input
                                        type="text"
                                        defaultValue={1}
                                        disabled
                                        className="bg-transparent text-custom-gray-500 outline-none w-full"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-custom-golden-600 hover:bg-custom-golden-700 text-custom-white-100 font-medium rounded-lg px-6 py-3 transition"
                                >
                                    Buscar
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-6 text-sm font-bold text-custom-white-100"
                    >
                        Origen: {origen || "Ninguno"} | Destino:{" "}
                        {destino || "Ninguno"} | Fecha:{" "}
                        {fecha ? formatDateToDDMMYYYY(fecha) : "Ninguna"}
                    </motion.p>
                </div>
            </div>
        </section>
    );
};

export default Hero;
