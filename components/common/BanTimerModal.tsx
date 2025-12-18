import React from "react";
import BanTimer from "@/components/common/BanTimer";
import { X } from "lucide-react";

interface Props {
    bannedUntil?: Date;
    isPermanent?: boolean;
    onClose: () => void;
}

const BanTimerModal = ({ bannedUntil, isPermanent, onClose }: Props) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <BanTimer bannedUntil={bannedUntil} isPermanent={isPermanent} />

                    <p className="text-xs text-center text-gray-500 mt-4 px-4">
                        Si crees que esto es un error, por favor contacta a soporte.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BanTimerModal;
