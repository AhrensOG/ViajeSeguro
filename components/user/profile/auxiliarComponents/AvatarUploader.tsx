"use client";

import React, { useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import Image from "next/image";
import { uploadFiles } from "@/lib/firebase/uploadFiles";
import { updateProfileAvatar } from "@/lib/api/client-profile";
import { toast } from "sonner";

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  userName?: string;
  userLastName?: string;
  userId?: string;
  onAvatarUpdated?: (newAvatarUrl: string) => void;
}

const AvatarUploader = ({
  currentAvatarUrl,
  userName,
  userLastName,
  userId,
  onAvatarUpdated,
}: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getInitials = () => {
    const first = userName?.[0] || "";
    const last = userLastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato no válido. Usa JPG, PNG o WebP");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 2MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      toast.error("Error al subir la imagen");
      return;
    }

    setIsUploading(true);
    try {
      const folder = `ProfilePictures/${userId}`;
      const urls = await uploadFiles([selectedFile], folder, false);
      
      if (urls?.[0]) {
        await updateProfileAvatar(urls[0]);
        onAvatarUpdated?.(urls[0]);
        toast.success("Foto de perfil actualizada");
        setSelectedFile(null);
        setPreview(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayUrl = preview || currentAvatarUrl || null;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-custom-gray-100 border-4 border-custom-golden-400 shadow-md flex items-center justify-center">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Foto de perfil"
              fill
              className="object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-custom-golden-100">
              <span className="text-3xl font-bold text-custom-golden-600">
                {getInitials()}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-custom-golden-500 hover:bg-custom-golden-600 text-white flex items-center justify-center shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="px-4 py-2 rounded-lg border border-custom-gray-300 text-custom-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-4 py-2 rounded-lg bg-custom-golden-500 hover:bg-custom-golden-600 text-white transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Subiendo..." : "Guardar"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="mt-3 text-sm text-custom-gray-600 hover:text-custom-golden-600 transition"
        >
          Cambiar foto de perfil
        </button>
      )}
    </div>
  );
};

export default AvatarUploader;