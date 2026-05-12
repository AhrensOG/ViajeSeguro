"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ChangePasswordModal from "./auxiliarComponents/ChangePasswordModal";
import { useSession } from "next-auth/react";
import SkeletonProfile from "@/lib/client/components/fallbacks/profile/SkeletonProfile";
import ReferralCard from "@/components/common/ReferralCard";
import { toast } from "sonner";
import { fetchUserData, updateProfile } from "../../../lib/api/client-profile";
import { UserProfile } from "@/lib/api/client-profile/clientProfile.types";
import { ClipboardCopyIcon, User, Mail, Phone, Link2, UserCheck } from "lucide-react";
import { BASE_URL } from "@/lib/constants";
import RestrictionTimer from "@/components/common/RestrictionTimer";

const ProfilePage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [restrictionDate, setRestrictionDate] = useState<Date | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UserProfile>({
        defaultValues: {
            email: "",
            name: "",
            lastName: "",
            phone: "",
            referralCode: "",
            referredByName: "",
            referralCodeFrom: "",
        },
    });

    const referralCode = watch("referralCode");
    const referredByName = watch("referredByName") || "";
    const url = BASE_URL;
    const [referredCount, setReferredCount] = useState<number>(0);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            if (!session?.user?.id) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await fetchUserData(session.user.id);
                if (res) {
                    setValue("email", res.email);
                    setValue("name", res.name);
                    setValue("lastName", res.lastName);
                    setValue("phone", res.phone || "");
                    setValue("referralCode", res.referralCode || "");

                    if (typeof res.referredCount === "number") {
                        setReferredCount(res.referredCount);
                    }

                    if (res.driverLicenseUrl && res.driverLicenseUrl.startsWith("RESTRICTED")) {
                        let date: Date | null = null;

                        if (res.driverLicenseUrl.startsWith("RESTRICTED|")) {
                            date = new Date(res.driverLicenseUrl.split("|")[1]);
                        } else {
                            const parts = res.driverLicenseUrl.split(':');
                            const dateStr = parts.slice(1, parts.length - 1).join(':');
                            date = new Date(dateStr);
                        }

                        if (date && !isNaN(date.getTime()) && date > new Date()) {
                            setRestrictionDate(date);
                        }
                    }

                    if (res.referralsTo?.length) {
                        const ref = res.referralsTo[0].referrer;
                        setValue("referredByName", `${ref.name} ${ref.lastName}`);
                    } else {
                        setValue("referredByName", null);
                    }
                }
            } catch (error) {
                console.log("Error al obtener el perfil del usuario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [session?.user?.id, setValue]);

    const onSubmit = async (values: UserProfile) => {
        const toastId = toast.loading("Actualizando información...");
        try {
            await updateProfile(values);
            toast.success("Información actualizada exitosamente", { id: toastId });
        } catch (error) {
            console.log(error);
            toast.info("Error al actualizar la información", { id: toastId });
        }
    };

    if (status === "loading" || isLoading) return <SkeletonProfile />;
    if (!session) return <div className="text-center py-20 text-gray-500">No se pudo cargar el perfil.</div>;

    const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all placeholder:text-gray-400";
    const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

    return (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-full pb-10">
            {restrictionDate && <RestrictionTimer restrictedUntil={restrictionDate} />}

            <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 space-y-8">
                {/* Referral section */}
                <ReferralCard
                    referralCode={watch("referralCode")}
                    title="Comparte y gana"
                    subtitle="Invita a tus amigos con tu enlace de referido"
                    referredCount={referredCount}
                />

                {/* Personal Information Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Actualiza tus datos de perfil</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                        {/* Nombre */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Nombre</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    {...register("name", { required: "El nombre es obligatorio" })}
                                    className={`${inputClass} pl-11`}
                                    placeholder="Tu nombre"
                                />
                            </div>
                            {errors.name && <p className="text-sm text-red-500 ml-1">{errors.name.message}</p>}
                        </div>

                        {/* Apellido */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Apellido</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    {...register("lastName", { required: "El apellido es obligatorio" })}
                                    className={`${inputClass} pl-11`}
                                    placeholder="Tu apellido"
                                />
                            </div>
                            {errors.lastName && <p className="text-sm text-red-500 ml-1">{errors.lastName.message}</p>}
                        </div>

                        {/* Correo */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    {...register("email")}
                                    disabled
                                    className={`${inputClass} pl-11 bg-gray-50 text-gray-500 cursor-not-allowed`}
                                />
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Teléfono (opcional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    {...register("phone")}
                                    className={`${inputClass} pl-11`}
                                    placeholder="Ingresa tu teléfono"
                                />
                            </div>
                        </div>

                        {/* Link de referido */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Tu link de referido</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Link2 className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    id="referral"
                                    type="text"
                                    readOnly
                                    value={`${url}/auth/register?ref=${referralCode}`}
                                    onClick={(e) => {
                                        navigator.clipboard.writeText(e.currentTarget.value);
                                        toast.success("¡Link copiado al portapapeles!");
                                    }}
                                    className={`${inputClass} pl-11 pr-11 bg-gray-50 text-amber-700 font-mono text-sm cursor-pointer`}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const link = `${url}/auth/register?ref=${referralCode}`;
                                        navigator.clipboard.writeText(link);
                                        toast.success("¡Link copiado al portapapeles!");
                                    }}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 transition-colors"
                                >
                                    <ClipboardCopyIcon size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Quien te refirió */}
                        <div className="space-y-1.5">
                            <label className={labelClass}>Te refirió</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserCheck className="w-4 h-4 text-gray-400" />
                                </div>
                                {referredByName ? (
                                    <input
                                        type="text"
                                        value={referredByName}
                                        readOnly
                                        className={`${inputClass} pl-11 bg-gray-50 text-amber-700 font-medium`}
                                    />
                                ) : (
                                    <input
                                        {...register("referralCodeFrom")}
                                        defaultValue=""
                                        className={`${inputClass} pl-11`}
                                        placeholder="Ingresa un código de referido"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25 transition-all duration-200 ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl hover:shadow-amber-500/30"
                            }`}
                        >
                            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </button>

                        {/* Cambiar contraseña */}
                        {!session?.user?.googleId && (
                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(true)}
                                    className="text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors underline underline-offset-2"
                                >
                                    Cambiar Contraseña
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <ChangePasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={session.user} />
        </div>
    );
};

export default ProfilePage;
