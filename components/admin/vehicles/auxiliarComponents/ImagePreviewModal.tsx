"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

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
    <div className="fixed inset-0 z-[1000] backdrop-blur-sm bg-transparent flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 z-50">
        <X className="size-6" />
      </button>

      <div className="relative w-[80vw] h-[80vh]">
        <Image
          src={src}
          alt="Vista previa"
          fill
          className="object-contain rounded shadow-lg"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
