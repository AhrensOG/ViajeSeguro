"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ChangePasswordModal from "./auxiliarComponents/ChangePasswordModal";
import { useSession } from "next-auth/react";
import Spinner from "@/lib/shared/Spinner";
import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";

interface UserProfile {
    email: string;
    name: string;
    lastName: string;
    phone?: string;
}

const ProfilePage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("El correo no es válido").required("El correo es obligatorio"),
        name: Yup.string().required("El nombre es obligatorio"),
        lastName: Yup.string().required("El apellido es obligatorio"),
        phone: Yup.string().matches(/^\d+$/, "El teléfono solo puede contener números").optional(),
    });

    const initialValues: UserProfile = {
        email: userData?.email || "",
        name: userData?.name || "",
        lastName: userData?.lastName || "",
        phone: userData?.phone || "",
    };

    const handleSubmit = async (values: UserProfile) => {
        try {
            await updateUser(values);
            setUserData(values);
            alert("Perfil actualizado correctamente");
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
        }
    };

    const updateUser = async (values: UserProfile) => {
        try {
            const res = await fetchWithAuth<UserProfile>(`${BACKEND_URL}/user/update/${session?.user?.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: values.name,
                    lastName: values.lastName,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res) {
                throw new Error("No se pudo actualizar el perfil");
            }
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            throw error; // Re-lanza el error para que handleSubmit lo capture
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const res = await fetchWithAuth<UserProfile>(`${BACKEND_URL}/user/${session?.user?.id}`, {
                    method: "GET",
                });
                setUserData(res); // Actualiza el estado con los datos del usuario
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.id) {
            fetchUser();
        }
    }, [session?.user?.id]);

    if (status === "loading" || isLoading) {
        return <Spinner />;
    }

    if (!session || !userData) {
        return <div className="text-center">No se pudo cargar el perfil.</div>; // Manejo de error si no hay sesión o datos
    }

    return (
        <div className="w-full mx-auto p-6 rounded-xl border border-custom-gray-300 bg-custom-white-100 shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 text-start mb-6">Informacion Personal</h1>
            <Formik initialValues={initialValues} enableReinitialize={true} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        {/* Nombre y Apellido */}
                        <div className="mb-6 flex flex-col border border-gray-300 p-3 gap-2 hover:border-black rounded-md shadow-sm shadow-gray-100">
                            <label htmlFor="name" className="text-[10px] font-semibold text-gray-600 uppercase">
                                Nombre
                            </label>
                            <Field name="name" type="text" disabled={false} className="border-none font-semibold text-gray-900 focus:outline-none" />
                        </div>

                        <div className="mb-6 flex flex-col border border-gray-300 p-3 gap-2 hover:border-black rounded-md shadow-sm shadow-gray-100">
                            <label htmlFor="lastName" className="text-[10px] font-semibold text-gray-600 uppercase">
                                Apellido
                            </label>
                            <Field name="lastName" type="text" className="border-none font-bold text-gray-900 focus:outline-none" />
                        </div>

                        {/* Campo de correo */}
                        <div className="mb-6 flex flex-col border border-gray-300 p-3 gap-2 hover:border-black rounded-md shadow-sm shadow-gray-100">
                            <label htmlFor="email" className="text-[10px] font-semibold text-gray-600 uppercase">
                                Correo Electrónico:
                            </label>
                            <Field
                                type="email"
                                name="email"
                                id="email"
                                disabled
                                className="border-none font-bold text-custom-golden-500 focus:outline-none"
                            />
                            <ErrorMessage name="email" component="div" className="text-sm text-orange-600 mt-1" />
                        </div>
                        {/* Campo de teléfono (opcional) */}
                        <div className="mb-6 flex flex-col border border-gray-300 p-3 gap-2 hover:border-black rounded-md shadow-sm shadow-gray-100">
                            <label htmlFor="phone" className="text-[10px] font-semibold text-gray-600 uppercase">
                                Teléfono (opcional):
                            </label>
                            <Field
                                type="tel"
                                name="phone"
                                id="phone"
                                placeholder="Ingresa tu teléfono"
                                className="border-none font-bold text-gray-900 focus:outline-none"
                            />
                            <ErrorMessage name="phone" component="div" className="text-sm text-orange-600 mt-1" />
                        </div>
                        {/* Botón de envío */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`mt-4 w-full  py-3 rounded-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white  shadow-sm transition duration-200 cursor-pointer ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            Guardar Cambios
                        </button>
                        {/* Botón para cambiar contraseña */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="w-full grid place-items-center py-4 underline hover:opacity-80 cursor-pointer"
                        >
                            Cambiar Contraseña
                        </button>
                    </Form>
                )}
            </Formik>
            {/* Modal para cambiar contraseña */}
            <ChangePasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={userData} />
        </div>
    );
};

export default ProfilePage;
