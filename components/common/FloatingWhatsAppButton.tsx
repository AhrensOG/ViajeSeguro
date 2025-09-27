"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

const WHATSAPP_LINK = "https://wa.me/34624051168";

export default function FloatingWhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[180]">
      <Link
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
        className="group block"
      >
        <div className="relative flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full shadow-md transition-all duration-150 ease-out hover:shadow-lg focus:outline-none"
             style={{ background: "linear-gradient(135deg, #25D366 0%, #20c15c 100%)" }}>
          {/* Animated glow/pulse ring */}
          <span className="pointer-events-none absolute inline-flex h-full w-full rounded-full animate-ping bg-custom-golden-600/20" />
          <span className="pointer-events-none absolute inline-flex h-[115%] w-[115%] rounded-full ring-2 ring-custom-golden-600/30 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* WhatsApp glyph (white for contrast) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="h-7 w-7 text-white drop-shadow-sm"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M19.11 17.47c-.27-.13-1.57-.77-1.81-.86-.24-.09-.42-.13-.6.13-.18.27-.69.86-.85 1.04-.16.18-.31.2-.58.07-.27-.13-1.13-.42-2.15-1.34-.79-.7-1.33-1.56-1.49-1.83-.16-.27-.02-.42.11-.55.11-.11.27-.29.4-.44.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.82-1.98-.22-.52-.44-.45-.6-.45-.16 0-.34-.02-.52-.02-.18 0-.47.07-.71.34-.24.27-.93.91-.93 2.22 0 1.31.95 2.58 1.09 2.76.13.18 1.88 2.87 4.57 4.02.64.28 1.14.45 1.53.58.64.2 1.22.17 1.68.1.51-.08 1.57-.64 1.8-1.26.22-.62.22-1.15.15-1.26-.07-.11-.24-.18-.51-.31z" />
            <path d="M26.6 5.4C23.9 2.7 20.2 1.2 16.3 1.2 8.6 1.2 2.3 7.5 2.3 15.2c0 2.4.6 4.7 1.8 6.8L2 30.8l9-2.9c2 .9 4.1 1.3 6.2 1.3 7.7 0 14-6.3 14-14 0-3.9-1.5-7.6-4.2-10.3zM17.3 26.5c-1.9 0-3.7-.5-5.4-1.2l-.4-.2-5.3 1.7 1.7-5.1-.2-.4c-1.1-1.8-1.6-3.8-1.6-5.8 0-6.4 5.2-11.6 11.6-11.6 3.1 0 6 1.2 8.2 3.4 2.2 2.2 3.4 5.1 3.4 8.2 0 6.4-5.2 11.6-11.6 11.6z" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
