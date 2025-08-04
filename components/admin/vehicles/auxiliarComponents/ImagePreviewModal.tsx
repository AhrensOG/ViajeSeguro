"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
    src: string;
    onClose: () => void;
}

const ImagePreviewModal = ({ src, onClose }: Props) => {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-70 flex items-center justify-center">
            <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-gray-300 z-50">
                <X className="size-6" />
            </button>
            <img src={src} alt="Vista previa" className="max-w-[90vw] max-h-[90vh] rounded shadow-lg" />
        </div>
    );
};

export default ImagePreviewModal;
