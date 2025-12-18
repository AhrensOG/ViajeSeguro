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
import { ClipboardCopyIcon } from "lucide-react";
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

                    // Check for restriction
                    if (res.driverLicenseUrl && res.driverLicenseUrl.startsWith("RESTRICTED")) {
                        let date: Date | null = null;

                        if (res.driverLicenseUrl.startsWith("RESTRICTED|")) {
                            date = new Date(res.driverLicenseUrl.split("|")[1]);
                        } else {
                            // Legacy: RESTRICTED:Date:Role
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
    if (!session) return <div className="text-center">No se pudo cargar el perfil.</div>;

    return (
        <div className="w-full flex flex-col items-center px-0 md:px-6 my-4 pb-10 bg-white">
            {restrictionDate && <RestrictionTimer restrictedUntil={restrictionDate} />}
            {/* Referral section */}
            <div className="w-full mb-4">
                <ReferralCard
                    referralCode={watch("referralCode")}
                    title="Comparte y gana"
                    subtitle="Invita a tus amigos con tu enlace de referido"
                    referredCount={referredCount}
                />
            </div>
            <div className="w-full flex flex-col justify-start items-start">
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Información Personal</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                {/* Nombre */}
                <div className="mb-6 flex flex-col border p-3 rounded-md shadow-sm gap-2">
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
                <div className="mb-6 flex flex-col border p-3 rounded-md shadow-sm gap-2">
                    <label htmlFor="lastName" className="text-[10px] font-semibold text-gray-600 uppercase">
                        Apellido
                    </label>
                    <input
                        {...register("lastName", {
                            required: "El apellido es obligatorio",
                        })}
                        className="border-none font-bold text-gray-900 focus:outline-none"
                    />
                    {errors.lastName && <p className="text-sm text-orange-600 mt-1">{errors.lastName.message}</p>}
                </div>

                {/* Correo */}
                <div className="mb-6 flex flex-col border p-3 rounded-md shadow-sm gap-2">
                    <label htmlFor="email" className="text-[10px] font-semibold text-gray-600 uppercase">
                        Correo Electrónico
                    </label>
                    <input {...register("email")} disabled className="border-none font-bold text-custom-golden-500 focus:outline-none" />
                </div>

                {/* Teléfono */}
                <div className="mb-6 flex flex-col border p-3 rounded-md shadow-sm gap-2">
                    <label htmlFor="phone" className="text-[10px] font-semibold text-gray-600 uppercase">
                        Teléfono (opcional)
                    </label>
                    <input
                        {...register("phone")}
                        placeholder="Ingresa tu teléfono"
                        className="border-none font-bold text-gray-900 focus:outline-none"
                    />
                </div>

                {/* Link de referido */}
                <div className="mb-6 flex flex-col border p-3 rounded-md shadow-sm gap-2">
                    <label htmlFor="referral" className="text-[10px] font-semibold text-gray-600 uppercase">
                        Tu link de referido:
                    </label>
                    <div className="relative">
                        <input
                            id="referral"
                            type="text"
                            readOnly
                            value={`${url}/auth/register?ref=${referralCode}`}
                            onClick={(e) => {
                                navigator.clipboard.writeText(e.currentTarget.value);
                                toast.success("¡Link copiado al portapapeles!");
                            }}
                            className="w-full pr-10 pl-3 py-2 font-mono text-sm text-custom-golden-600 font-semibold bg-gray-50 border rounded-md shadow-sm cursor-pointer focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const link = `${url}/auth/register?ref=${referralCode}`;
                                navigator.clipboard.writeText(link);
                                toast.success("¡Link copiado al portapapeles!");
                            }}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-orange-600"
                        >
                            <ClipboardCopyIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Quien te refirió */}
                <div className="mb-6 flex flex-col border border-gray-300 p-3 gap-2 hover:border-black rounded-md shadow-sm shadow-gray-100">
                    <label htmlFor="referredBy" className="text-[10px] font-semibold text-gray-600 uppercase">
                        Te refirió:
                    </label>

                    {referredByName ? (
                        <input
                            id="referredBy"
                            type="text"
                            value={referredByName}
                            readOnly
                            className="border-none font-bold text-custom-golden-600 bg-gray-50 focus:outline-none"
                        />
                    ) : (
                        <input
                            id="referralCodeFrom"
                            {...register("referralCodeFrom")}
                            defaultValue=""
                            placeholder="Ingresa un código de referido"
                            className="border-none font-bold text-gray-900 focus:outline-none"
                        />
                    )}
                </div>

                {/* Botón Guardar */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-4 w-full py-3 rounded-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition duration-200 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    Guardar Cambios
                </button>

                {/* Cambiar contraseña */}
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

            <ChangePasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={session.user} />
        </div>
    );
};

export default ProfilePage;
