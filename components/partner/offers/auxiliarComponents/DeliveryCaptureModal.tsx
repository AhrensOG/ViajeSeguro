"use client"
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { X, Camera, Trash2, Upload } from "lucide-react";
import { uploadFiles } from "@/lib/firebase/uploadFiles";
import { toast } from "sonner";

interface DeliveryCaptureModalProps {
  isOpen: boolean;
  bookingId: string | null;
  onClose: () => void;
  onComplete: (urls: string[]) => void;
}

export default function DeliveryCaptureModal({ isOpen, bookingId, onClose, onComplete }: DeliveryCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const MAX_PHOTOS = 8;
  const MIN_PHOTOS = 3; // Recomendado: vehículo, odómetro, combustible

  useEffect(() => {
    if (!isOpen || !bookingId) return;

    async function initCamera() {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("No se pudo acceder a la cámara:", err);
        setCameraError("No se pudo acceder a la cámara. Asegúrate de haber dado permisos y de usar un dispositivo con cámara.");
      }
    }

    initCamera();

    // Capturar el valor actual del ref para usarlo de forma segura en el cleanup
    const videoEl = videoRef.current;
    return () => {
      // Detener cámara al cerrar
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoEl) {
        try { videoEl.pause(); } catch {}
        (videoEl as HTMLVideoElement & { srcObject?: MediaStream | null }).srcObject = null;
      }
      setCapturedFiles([]);
    };
  }, [isOpen, bookingId]);

  const handleCapture = async () => {
    if (!videoRef.current) return;
    if (capturedFiles.length >= MAX_PHOTOS) {
      toast.error(`Máximo ${MAX_PHOTOS} fotos`);
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (!blob) return;

    const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
    setCapturedFiles((prev) => [...prev, file]);
  };

  const handleDelete = (idx: number) => {
    setCapturedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUploadAndContinue = async () => {
    if (!bookingId) return;
    if (capturedFiles.length < MIN_PHOTOS) {
      toast.error(`Captura al menos ${MIN_PHOTOS} fotos (vehículo completo, odómetro y combustible)`);
      return;
    }
    try {
      setIsUploading(true);
      const urls = await uploadFiles(capturedFiles, `vehicle-deliveries/${bookingId}`, `delivery_${bookingId}`);
      toast.success("Fotos subidas correctamente");
      onComplete(urls);
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Error al subir las fotos");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Capturar fotos de entrega</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 grid gap-4">
          {/* Indicaciones */}
          <div className="text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded p-3">
            <p className="font-medium">Requisitos:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Captura obligatoria del odómetro (kilometraje) y del nivel de combustible.</li>
              <li>Toma fotos del vehículo completo (todos los lados) y de cualquier detalle relevante.</li>
              <li>Máximo 8 fotos. Mínimo 3 fotos (vehículo, odómetro y combustible).</li>
              <li>Estas fotos son necesarias para dejar constancia del estado de entrega. Ayudan a proteger tu seguro y a resolver cualquier incidente con evidencia clara. Aunque la probabilidad de incidentes es baja, es importante prevenir.</li>
            </ul>
          </div>

          {/* Cámara */}
          {cameraError ? (
            <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded p-3">{cameraError}</div>
          ) : (
            <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-contain" playsInline muted />
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center">
                <button
                  onClick={handleCapture}
                  disabled={capturedFiles.length >= MAX_PHOTOS}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 disabled:opacity-50"
                >
                  <Camera className="h-5 w-5" /> Capturar
                </button>
              </div>
            </div>
          )}

          {/* Thumbnails */}
          {capturedFiles.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Fotos capturadas: {capturedFiles.length}/{MAX_PHOTOS}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {capturedFiles.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img src={URL.createObjectURL(file)} alt={`captura-${idx}`} className="w-full h-24 object-cover rounded border" />
                    <button
                      onClick={() => handleDelete(idx)}
                      className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow hover:bg-white"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t">
          <div className="text-xs text-gray-500">Captura con la cámara del dispositivo.</div>
          <button
            onClick={handleUploadAndContinue}
            disabled={isUploading || capturedFiles.length < MIN_PHOTOS}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" /> Subir y continuar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
