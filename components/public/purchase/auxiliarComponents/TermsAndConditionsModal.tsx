"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type TermsAndConditionsModalProps = {
  show: boolean;
  onClose: () => void;
  onAccept: () => void;
};

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ show, onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const acceptBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!show) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    // Focus accept button on open for accessibility
    const t = setTimeout(() => acceptBtnRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(t);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl bg-custom-white-100 rounded-xl shadow-2xl border border-custom-gray-300 overflow-hidden"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-custom-golden-300 bg-gradient-to-r from-custom-golden-600 to-custom-golden-700 text-custom-white-100">
          <h2 id="terms-title" className="text-xl font-semibold">Términos y Condiciones de Viaje Seguro</h2>
          <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-md hover:bg-custom-golden-500/30 focus:outline-none focus:ring-2 focus:ring-custom-white-100/70">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5 space-y-5 text-[0.95rem] leading-6 text-custom-gray-900">
          <p className="text-xs text-custom-gray-500">Última actualización: 18/10/2025</p>

          <p>
            Importante: Este documento regula el uso de la plataforma “Viaje Seguro” y sus servicios vinculados, incluyendo la
            contratación de viajes por pasajeros, la publicación y organización de viajes por conductores/partners, y la publicación
            y alquiler de vehículos por propietarios (owners) y su contratación por arrendatarios (renters). Si no aceptas estos
            términos, no utilices la plataforma.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">1. Identidad del Prestador y Contacto</h3>
          <p>
            Razón social: [Viaje Seguro S.L.] · CIF/NIF: [XXXXXXXXX] · Domicilio social: [Dirección completa, Ciudad, País]
            · Email: [legal@viajeseguro.com] · Teléfono: [+34 XXX XXX XXX] · Sitio: https://viajeseguro.com · DPO: [contacto DPO]
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">2. Definiciones</h3>
          <p>
            Plataforma, Usuario, Pasajero, Conductor/Partner, Propietario/Owner, Arrendatario/Renter, Viaje, Alquiler de vehículo,
            Comisión/Tarifa de servicio, KYC, Contenido, según lo detallado en los Términos completos.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">3. Objeto y Ámbito</h3>
          <p>
            Estos Términos regulan el acceso y uso de la Plataforma y las relaciones entre Usuarios y Viaje Seguro. La Plataforma
            actúa como intermediario tecnológico salvo indicación expresa.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">4. Aceptación y Modificación</h3>
          <p>
            El uso implica aceptación plena. Viaje Seguro podrá modificar los Términos por razones legales u operativas; las
            modificaciones se notificarán y serán aplicables desde su publicación.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">5. Cuenta y Verificación</h3>
          <p>
            Mayores de 18 años. Datos veraces y actualizados. El Usuario es responsable de sus credenciales. Viaje Seguro puede
            requerir KYC/KYB y documentación adicional.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">6. Rol de Viaje Seguro</h3>
          <p>
            Intermediación tecnológica. No presta por sí el servicio de transporte ni es parte del contrato de alquiler salvo
            indicación. No garantiza disponibilidad, aunque aplica controles razonables y antifraude.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">7. Publicación y Organización de Viajes</h3>
          <p>
            Conductores deben cumplir licencias/seguros y normativa de transporte. La información del viaje debe ser veraz. Precios,
            comisiones, cancelaciones y evaluaciones se rigen por lo indicado en la Plataforma.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">8. Contratación de Viajes (Pasajeros)</h3>
          <p>
            La reserva se confirma con el pago o aceptación. El precio final puede incluir impuestos y comisiones. Cancelaciones y
            reembolsos según políticas visibles. Conducta adecuada y respeto de normas de seguridad.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">9. Publicación de Vehículos (Propietarios)</h3>
          <p>
            Acreditar titularidad/derecho de uso, ITV/seguro vigentes y estado seguro. Descripción veraz. Viaje Seguro puede aprobar o
            rechazar publicaciones.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">10. Alquiler de Vehículos (Arrendatarios)</h3>
          <p>
            Licencia adecuada, edad mínima. Depósito/fianza si aplica. Respetar límites de uso, combustible y devolución; daños o
            multas son a cargo del arrendatario.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">11. Pagos, Comisiones e Impuestos</h3>
          <p>
            Procesados por proveedores autorizados. Comisiones y cargos se detallan en el Anexo de Tarifas. Obligaciones fiscales a
            cargo del Usuario según normativa.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">12. Cancelaciones y No-Show</h3>
          <p>
            Políticas expuestas antes del pago para viajes y alquileres. Fuerza mayor puede eximir penalizaciones con acreditación.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">13–20. Verificación, Conducta, Propiedad Intelectual, Privacidad y Responsabilidad</h3>
          <p>
            Moderación de contenidos, protección de datos conforme a la Política de Privacidad, seguros obligatorios, limitación de
            responsabilidad salvo dolo o culpa grave, medidas antifraude y posibilidad de suspensión o cierre por incumplimientos.
          </p>

          <h3 className="font-semibold text-custom-golden-700 text-base">21–30. Reclamaciones, Ley Aplicable y Aceptación</h3>
          <p>
            Soporte en [soporte@viajeseguro.com]. Ley aplicable y jurisdicción: [Ciudad, País], salvo normas imperativas de consumo.
            El Usuario declara haber leído y aceptado los Términos.
          </p>

          <hr className="my-2" />
          <p className="text-xs text-custom-gray-600">
            Nota: Este resumen presenta los puntos clave. La versión íntegra de los Términos y Condiciones, incluida la política de
            cancelación, anexos de tarifas y requisitos, está disponible en la sección legal del sitio.
            {" "}
            <a
              href="/legal/terminos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-custom-golden-700 hover:underline font-medium"
            >
              Ver versión completa
            </a>
          </p>
        </div>

        <div className="sticky bottom-0 px-6 py-4 border-t border-custom-golden-300 bg-custom-golden-50/60 backdrop-blur flex items-center justify-between gap-3">
          <label className="inline-flex items-start gap-3 text-sm text-custom-gray-700 select-none">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-custom-gray-400 focus:ring-custom-golden-600"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>
              He leído y acepto los <span className="font-medium text-custom-golden-800">Términos y Condiciones</span> de Viaje Seguro
            </span>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-custom-golden-300 text-custom-golden-800 hover:bg-custom-golden-100 focus:outline-none focus:ring-2 focus:ring-custom-golden-600"
            >
              Cancelar
            </button>
            <button
              ref={acceptBtnRef}
              onClick={onAccept}
              disabled={!accepted}
              className={`px-4 py-2 rounded-md text-custom-white-100 transition-colors ${accepted ? "bg-custom-golden-600 hover:bg-custom-golden-700 focus:outline-none focus:ring-2 focus:ring-custom-golden-600" : "bg-custom-gray-300 cursor-not-allowed"}`}
            >
              Aceptar y continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
