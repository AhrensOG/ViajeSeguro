"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ChangePasswordModal from "./auxiliarComponents/ChangePasswordModal";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/functions";
import SkeletonProfile from "@/lib/client/components/fallbacks/profile/SkeletonProfile";
import { toast } from "sonner";

interface UserProfile {
    email: string;
    name: string;
    lastName: string;
    phone?: string;
}

const ProfilePage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<UserProfile>({
        defaultValues: {
            email: "",
            name: "",
            lastName: "",
            phone: "",
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const res = await fetchWithAuth<UserProfile>(`${BACKEND_URL}/user/${session?.user?.id}`, {
                    method: "GET",
                });

                if (res) {
                    setValue("email", res.email);
                    setValue("name", res.name);
                    setValue("lastName", res.lastName);
                    setValue("phone", res.phone || "");
                }
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.id) {
            fetchUser();
        }
    }, [session?.user?.id, setValue]);

    const onSubmit = async (values: UserProfile) => {
        return toast.promise(updateProfile(values), {
            loading: "Actualizando perfil...",
            success: () => {
                return "Perfil actualizado exitosamente";
            },
            error: (err) => {
                return "Error al actualizar el perfil";
            },
        });
    };

    const updateProfile = async (values: UserProfile): Promise<void> => {
        try {
            await fetchWithAuth(`${BACKEND_URL}/user/update`, {
                method: "PUT",
                body: JSON.stringify({
                    name: values.name,
                    lastName: values.lastName,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            throw new Error("Error al actualizar el perfil");
        }
    };

    if (status === "loading" || isLoading) {
        return <SkeletonProfile />;
    }

    if (!session) {
        return <div className="text-center">No se pudo cargar el perfil.</div>;
    }

    return (
        <div className="w-full mx-auto p-6 rounded-xl border border-custom-gray-300 bg-custom-white-100 shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 text-start mb-6">Información Personal</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nombre */}
                <div className="mb-6 flex flex-col border border-gray-300 p-3 gap-2 hover:border-black rounded-md shadow-sm shadow-gray-100">
                    <label htmlFor="name" className="text-[10px] font-semibold text-gray-600 uppercase">
                        Nombre
                    </label>
                    <input
                        {...register("name", { required: "El nombre es obligatorio" })}
                        className="border-none font-semibold text-gray-900 focus:outline-none"
                    />
                    {errors.name && <p className="text-sm text-orange-600 mt-1">{errors.name.message}</p>}
                </div>

                {/* Apellido */}
                <div className="mb-6 flex flex-col border border-gray-300 p-3 gap-2 hover:border-black rounded-md shadow-sm shadow-gray-100">
                    <label htmlFor="lastName" className="text-[10px] font-semibold text-gray-600 uppercase">
                        Apellido
                    </label>
                    <input
                        {...register("lastName", { required: "El apellido es obligatorio" })}
                        className="border-none font-bold text-gray-900 focus:outline-none"
                    />
                    {errors.lastName && <p className="text-sm text-orange-600 mt-1">{errors.lastName.message}</p>}
                </div>

                {/* Correo (solo lectura) */}
                <div className="mb-6 flex flex-col border border-gray-300 p-3 gap-2 hover:border-black rounded-md shadow-sm shadow-gray-100">
                    <label htmlFor="email" className="text-[10px] font-semibold text-gray-600 uppercase">
                        Correo Electrónico:
                    </label>
                    <input
                        {...register("email", {
                            required: "El correo es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "El correo no es válido",
                            },
                        })}
                        disabled
                        className="border-none font-bold text-custom-golden-500 focus:outline-none"
                    />
                    {errors.email && <p className="text-sm text-orange-600 mt-1">{errors.email.message}</p>}
                </div>

                {/* Teléfono */}
                <div className="mb-6 flex flex-col border border-gray-300 p-3 gap-2 hover:border-black rounded-md shadow-sm shadow-gray-100">
                    <label htmlFor="phone" className="text-[10px] font-semibold text-gray-600 uppercase">
                        Teléfono (opcional):
                    </label>
                    <input
                        {...register("phone", {
                            pattern: {
                                value: /^\d+$/,
                                message: "El teléfono solo puede contener números",
                            },
                        })}
                        placeholder="Ingresa tu teléfono"
                        className="border-none font-bold text-gray-900 focus:outline-none"
                    />
                    {errors.phone && <p className="text-sm text-orange-600 mt-1">{errors.phone.message}</p>}
                </div>

                {/* Botón guardar */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-4 w-full py-3 rounded-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition duration-200 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    Guardar Cambios
                </button>

                {/* Botón cambiar contraseña */}

                {!session?.user?.googleId && (
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="w-full grid place-items-center py-4 underline hover:opacity-80 cursor-pointer"
                    >
                        Cambiar Contraseña
                    </button>
                )}
            </form>

            {/* Modal de cambio de contraseña */}
            <ChangePasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={session.user} />
        </div>
    );
};

export default ProfilePage;
