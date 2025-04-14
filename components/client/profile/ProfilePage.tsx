"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ChangePasswordModal from "./auxiliarComponents/ChangePasswordModal";

interface UserFormValues {
    email: string;
    name: string;
    lastName: string;
    phone?: string;
}

interface UserProfile {
    email: string;
    name: string;
    lastName: string;
    phone?: string; // Opcional, si no se requiere
}

const ProfilePage = () => {
    // Estado para el modal
    const [isOpen, setIsOpen] = useState(false);

    // Datos del usuario
    const userProfile: UserProfile = {
        email: "usuario@example.com", // Reemplaza con datos reales
        name: "Juan",
        lastName: "Pérez",
        phone: "123456789", // Opcional
    };

    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("El correo no es válido").required("El correo es obligatorio"),
        name: Yup.string().required("El nombre es obligatorio"),
        lastName: Yup.string().required("El apellido es obligatorio"),
        phone: Yup.string().matches(/^\d+$/, "El teléfono solo puede contener números").optional(), // Opcional, si no se requiere
    });

    // Valores iniciales del formulario
    const initialValues: UserFormValues = {
        email: userProfile.email || "",
        name: userProfile.name || "",
        lastName: userProfile.lastName || "",
        phone: userProfile.phone || "",
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (values: UserFormValues) => {
        console.log("Datos enviados:", values);
        alert("Perfil actualizado correctamente");
    };

    return (
        <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Editar Perfil</h1>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        {/* Contenedor para Nombre y Apellido */}
                        <div className="flex flex-col md:flex-row md:gap-4">
                            {/* Campo de nombre */}
                            <div className="flex-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nombre:
                                </label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Ingresa tu nombre"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                />
                                <ErrorMessage name="name" component="div" className="text-sm text-orange-600 mt-1" />
                            </div>

                            {/* Campo de apellido */}
                            <div className="flex-1">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                    Apellido:
                                </label>
                                <Field
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    placeholder="Ingresa tu apellido"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                />
                                <ErrorMessage name="lastName" component="div" className="text-sm text-orange-600 mt-1" />
                            </div>
                        </div>

                        {/* Campo de correo */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo Electrónico:
                            </label>
                            <Field
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Ingresa tu correo"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                            />
                            <ErrorMessage name="email" component="div" className="text-sm text-orange-600 mt-1" />
                        </div>

                        {/* Campo de teléfono (opcional) */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Teléfono (opcional):
                            </label>
                            <Field
                                type="tel"
                                name="phone"
                                id="phone"
                                placeholder="Ingresa tu teléfono"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                            />
                            <ErrorMessage name="phone" component="div" className="text-sm text-orange-600 mt-1" />
                        </div>

                        {/* Botón de envío */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md shadow-sm transition duration-200 ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            Guardar Cambios
                        </button>

                        {/* Botón para cambiar contraseña */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md shadow-sm transition duration-200 mt-4"
                        >
                            Cambiar Contraseña
                        </button>
                    </Form>
                )}
            </Formik>

            {/* Modal para cambiar contraseña */}
            <ChangePasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={userProfile} />
        </div>
    );
};

export default ProfilePage;
