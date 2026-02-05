"use client"
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { X, Camera, Upload } from "lucide-react";
import { uploadFiles } from "@/lib/firebase/uploadFiles";
import { addVehicleBookingMedia } from "@/lib/api/vehicle-booking";
import { toast } from "sonner";

type OwnerPhase = 'OWNER_PRE' | 'OWNER_POST';

interface DeliveryCaptureModalProps {
  isOpen: boolean;
  bookingId: string | null;
  onClose: () => void;
  onComplete: (urls: string[]) => void;
  phase?: OwnerPhase; // default OWNER_PRE
}

type GuidedStep = {
  key: string;
  label: string;
  hint: string;
};

const CAPTURE_STEPS: GuidedStep[] = [
  { key: "odometer_photo", label: "Odómetro (kilometraje)", hint: "Enfoca el tablero para que los números se vean nítidos" },
  { key: "fuel_photo", label: "Nivel de combustible", hint: "Enfoca el indicador para que se aprecie claramente" },
  { key: "front_photo", label: "Frente del vehículo", hint: "Toma la foto de frente, manteniendo el vehículo centrado" },
  { key: "left_side_photo", label: "Lateral izquierdo", hint: "Fotografía el lado izquierdo completo del vehículo" },
  { key: "rear_photo", label: "Parte trasera", hint: "Toma la foto desde atrás, con buena iluminación" },
  { key: "right_side_photo", label: "Lateral derecho", hint: "Fotografía el lado derecho completo del vehículo" },
  { key: "interior_photo", label: "Interior", hint: "Incluye asientos delanteros y tablero si es posible" },
  { key: "detail_photo", label: "Detalle adicional", hint: "Cualquier marca o detalle que quieras dejar registrado" },
];

export default function DeliveryCaptureModal({ isOpen, bookingId, onClose, onComplete, phase = 'OWNER_PRE' }: DeliveryCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Paso 0 (formulario) -> ingresar kilometraje; luego guía de 8 fotos
  const [kmValue, setKmValue] = useState<string>("");
  const [stepIndex, setStepIndex] = useState<number>(-1); // -1 = formulario km, 0..7 = pasos de cámara
  const [capturedByStep, setCapturedByStep] = useState<(File | null)[]>(Array(CAPTURE_STEPS.length).fill(null));
  const [isUploading, setIsUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const MAX_PHOTOS = CAPTURE_STEPS.length;
  const MIN_PHOTOS = CAPTURE_STEPS.length - 1; // El paso 8 (detalle) es opcional

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

    // Solo iniciamos la cámara cuando entramos al primer paso de captura
    if (stepIndex >= 0) {
      initCamera();
    }

    // Capturar el valor actual del ref para usarlo de forma segura en el cleanup
    const videoEl = videoRef.current;
    return () => {
      // Detener cámara al cambiar paso o cerrar
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoEl) {
        try { videoEl.pause(); } catch { }
        (videoEl as HTMLVideoElement & { srcObject?: MediaStream | null }).srcObject = null;
      }
      // IMPORTANTE: No resetear estados aquí, porque este cleanup corre al cambiar stepIndex
    };
  }, [isOpen, bookingId, stepIndex]);

  // Resetear estados SOLO cuando el modal se cierra desde fuera
  useEffect(() => {
    if (!isOpen) {
      setCapturedByStep(Array(CAPTURE_STEPS.length).fill(null));
      setStepIndex(-1);
      setKmValue("");
    }
  }, [isOpen]);

  const handleCapture = async () => {
    if (!videoRef.current) return;
    if (stepIndex < 0 || stepIndex >= CAPTURE_STEPS.length) return;

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

    const stepKey = CAPTURE_STEPS[stepIndex].key;
    const file = new File([blob], `${stepKey}_${Date.now()}.jpg`, { type: "image/jpeg" });
    setCapturedByStep((prev) => {
      const copy = [...prev];
      copy[stepIndex] = file;
      return copy;
    });
  };

  const handleRetake = (idx: number) => {
    // Permite volver a tomar la foto de un paso específico
    if (idx < 0 || idx >= CAPTURE_STEPS.length) return;
    setCapturedByStep((prev) => {
      const copy = [...prev];
      copy[idx] = null;
      return copy;
    });
    setStepIndex(idx);
  };

  const handleUploadAndContinue = async () => {
    if (!bookingId) return;
    // Solo requerimos 7 fotos (excluyendo detalle)
    // El detalle es el índice 7 (CAPTURE_STEPS.length - 1)

    // Verificamos si falta alguna de las primeras 7 fotos
    const mandatoryPhotos = capturedByStep.slice(0, MIN_PHOTOS);
    const missing = mandatoryPhotos.some(f => !f);

    if (missing) {
      toast.error("Debes completar todas las fotos obligatorias antes de continuar");
      return;
    }
    try {
      setIsUploading(true);
      const files = capturedByStep.filter((f): f is File => !!f);
      const urls = await uploadFiles(files, `vehicle-deliveries/${bookingId}`, `delivery_${bookingId}`);
      // Persistir en backend como evidencia del retiro del arrendatario
      const mileageNumber = Number(kmValue);
      await addVehicleBookingMedia(bookingId, {
        phase,
        urls,
        mileage: Number.isFinite(mileageNumber) ? mileageNumber : undefined,
      });
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

  const currentStepIsOptional = stepIndex === CAPTURE_STEPS.length - 1; // Último paso es opcional
  const title = phase === 'OWNER_POST' ? "Registro fotográfico de devolución" : "Registro fotográfico de entrega";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-50" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 grid gap-4">
          {/* Paso 0: formulario de kilometraje (antes de activar cámara) */}
          {stepIndex === -1 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-5">
                <p className="text-sm text-gray-900 font-medium">Antes de comenzar</p>
                <ul className="list-disc ml-5 mt-2 space-y-1 text-sm text-gray-800">
                  <li>Ingresa el kilometraje actual del vehículo (odómetro).</li>
                  <li>Luego, tomaremos 8 fotos guiadas para documentar el estado del vehículo.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-800">Kilometraje (km)</label>
                <input
                  type="number"
                  min={0}
                  value={kmValue}
                  onChange={(e) => setKmValue(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  placeholder="Ej. 54.231"
                  inputMode="numeric"
                />
                <p className="text-xs text-gray-500">Este dato ayuda a dejar constancia del estado de entrega.</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const n = Number(kmValue);
                    if (!Number.isFinite(n) || n < 0) {
                      toast.error("Ingresa un kilometraje válido");
                      return;
                    }
                    setStepIndex(0);
                    toast.info("Paso 1/8: Toma una foto nítida del odómetro (kilometraje)");
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow-sm hover:bg-orange-700"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Pasos de cámara guiados */}
          {stepIndex >= 0 && (
            <>
              {/* Indicaciones */}
              {/* Barra de progreso */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-600 transition-all"
                  style={{ width: `${((stepIndex) / (CAPTURE_STEPS.length)) * 100}%` }}
                />
              </div>

              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">Paso {stepIndex + 1} de {CAPTURE_STEPS.length}</p>
                  <span className="text-xs text-orange-700 px-2 py-1 rounded-full bg-white border border-orange-200">{CAPTURE_STEPS[stepIndex].label}</span>
                </div>
                <p className="mt-2 text-sm text-gray-800">
                  {CAPTURE_STEPS[stepIndex].hint}
                  {currentStepIsOptional && <span className="block font-bold mt-1 text-orange-700">(Este paso es opcional)</span>}
                </p>
              </div>

              {/* Cámara */}
              {cameraError ? (
                <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded p-3">{cameraError}</div>
              ) : (
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden ring-1 ring-gray-200">
                  {/* Mostrar video si aún no se capturó foto en este paso */}
                  {!capturedByStep[stepIndex] ? (
                    <>
                      <video ref={videoRef} className="w-full h-full object-contain" playsInline muted />
                      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3">
                        <button
                          onClick={handleCapture}
                          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-full shadow-sm hover:bg-orange-700 disabled:opacity-50"
                        >
                          <Camera className="h-5 w-5" /> Capturar foto
                        </button>

                        {/* Botón Omitir para paso opcional */}
                        {currentStepIsOptional && (
                          <button
                            onClick={handleUploadAndContinue}
                            className="px-5 py-2.5 bg-gray-700/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-600 text-sm font-medium"
                          >
                            Omitir y Finalizar
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    // Mostrar la foto recién capturada como vista previa
                    <>
                      <img
                        src={URL.createObjectURL(capturedByStep[stepIndex] as File)}
                        alt="captura-previa"
                        className="w-full h-full object-contain bg-black"
                      />
                      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleRetake(stepIndex)}
                          className="px-4 py-2 bg-white text-gray-800 rounded-full hover:bg-orange-50 border border-orange-200"
                        >
                          Repetir foto
                        </button>
                        {stepIndex < CAPTURE_STEPS.length - 1 && (
                          <button
                            onClick={() => setStepIndex((i) => Math.min(i + 1, CAPTURE_STEPS.length - 1))}
                            className="px-4 py-2 bg-orange-600 text-white rounded-full shadow-sm hover:bg-orange-700"
                          >
                            Siguiente foto
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Progreso (secuencial) */}
              <p className="text-sm text-gray-600 text-center">Progreso: {capturedByStep.filter(Boolean).length}/{MAX_PHOTOS} fotos</p>
            </>
          )}
        </div>

        {stepIndex >= 0 && capturedByStep.filter(Boolean).length >= MIN_PHOTOS && (
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">Revisa que todas las fotos se vean claras antes de continuar.</div>
            <button
              onClick={handleUploadAndContinue}
              disabled={isUploading}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 shadow-sm"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" /> Subir y finalizar
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
