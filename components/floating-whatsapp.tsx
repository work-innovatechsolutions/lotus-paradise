"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const message = encodeURIComponent(
    "Hello Lotus Paradise Homestay! I would like to inquire about room availability and packages in Latpanchar."
  );

  return (
    <a
      href={`https://wa.me/919832012345?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 group transition-all duration-300 transform hover:scale-110"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-xs font-accent font-bold uppercase tracking-wider pr-1">
        WhatsApp Us
      </span>
    </a>
  );
}
