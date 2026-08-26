"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import WhatsAppIcon from "@/components/whatsapp-icon";
import { X, Send, Sparkles, MessageCircle, ChevronRight, ShieldCheck } from "lucide-react";

const PHONE_NUMBER = "919832012345";

const QUICK_PROMPTS = [
  {
    icon: "🛏️",
    label: "Check Room Availability",
    text: "Hello The Cometas! I would like to check room availability and rates for an upcoming stay in Latpanchar.",
  },
  {
    icon: "🦅",
    label: "Bird Watching & Hornbill Tour",
    text: "Hello! I am interested in the Hornbill & Bird Watching guided forest trail package at Latpanchar.",
  },
  {
    icon: "🚗",
    label: "NJP / Bagdogra Pick-up & Travel",
    text: "Hello! Can you help me with travel directions and car pick-up options from NJP/Bagdogra to Latpanchar?",
  },
  {
    icon: "🏢",
    label: "Corporate / Group Booking",
    text: "Hello! We are planning a group retreat / corporate stay and would like a custom quote and meal plan.",
  },
];

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  // Hide on admin routes
  if (pathname.startsWith("/admin")) return null;

  const defaultMsg = encodeURIComponent(
    "Hello The Cometas! I would like to inquire about room availability and packages in Latpanchar."
  );

  const handleOpenWhatsApp = (customText?: string) => {
    const msg = customText
      ? encodeURIComponent(customText)
      : defaultMsg;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-22 right-5 sm:right-6 z-50 flex flex-col items-end pointer-events-auto transition-all duration-300">
      {/* ── LUXURY CHAT POPOVER CARD ── */}
      {isOpen && (
        <div className="mb-3 w-[90vw] sm:w-96 bg-[#1a1442] rounded-3xl border-2 border-[#C89D45] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25D366] via-[#1EBE5D] to-[#128C7E] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-white p-1 shadow-md border border-white/40 flex items-center justify-center shrink-0">
                <Image
                  src="/The Cometas Logo.png"
                  alt="The Cometas"
                  width={38}
                  height={38}
                  className="object-contain"
                />
                {/* Live green pulse dot */}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide leading-tight text-white flex items-center gap-1.5">
                  <span>The Cometas Concierge</span>
                  <Sparkles className="w-3 h-3 text-amber-200" />
                </h4>
                <p className="text-[11px] text-white/90 font-sans flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Online · Replies within minutes</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-black/20 transition-colors"
              title="Close chat card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Greeting speech bubble */}
            <div className="bg-[#2C2473]/70 border border-[#C89D45]/30 rounded-2xl p-3.5 text-xs text-gray-200 leading-relaxed relative">
              <p className="font-medium text-white mb-1">
                👋 Namaste &amp; Welcome to Latpanchar!
              </p>
              <p className="text-gray-300">
                How can we assist your Himalayan retreat today? Choose a quick option below or message our desk directly.
              </p>
              <span className="text-[9px] text-[#C89D45] block text-right mt-1 font-mono font-semibold">
                Official WhatsApp Desk
              </span>
            </div>

            {/* Quick Prompt Action Chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
                Quick Inquiries
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOpenWhatsApp(prompt.text)}
                    className="w-full text-left p-2.5 rounded-xl bg-black/40 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366] text-gray-200 hover:text-white transition-all flex items-center justify-between group/chip"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-sm shrink-0">{prompt.icon}</span>
                      <span className="text-xs font-accent font-semibold truncate">
                        {prompt.label}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C89D45] group-hover/chip:text-[#25D366] group-hover/chip:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Open WhatsApp Button */}
            <button
              type="button"
              onClick={() => handleOpenWhatsApp()}
              className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 rounded-xl font-accent text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg transition-all duration-200 transform active:scale-98 border border-white/20"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Start Direct Chat</span>
              <Send className="w-3.5 h-3.5 ml-1 opacity-80" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 text-center">
              <ShieldCheck className="w-3 h-3 text-[#C89D45]" />
              <span>Verified Business Number · Instant Response</span>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING BUTTON ROW WITH TOOLTIP ── */}
      <div className="flex items-center gap-3">
        {/* Floating Tooltip Bubble (Dismissible / Auto) */}
        {!isOpen && showBubble && (
          <div className="hidden sm:flex items-center gap-2 bg-[#1a1442]/95 border border-[#C89D45] text-white px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-xs font-accent font-semibold text-gray-100 hover:text-[#C89D45] transition-colors whitespace-nowrap text-left"
            >
              Need help? <strong>Chat with Host</strong> 👋
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="text-gray-400 hover:text-white p-0.5 rounded-full"
              title="Dismiss tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Floating Action Button */}
        <div className="relative group">
          {/* Pulsing Radar Ring Wave */}
          <span className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#25D366] to-[#C89D45] opacity-40 blur-sm pointer-events-none group-hover:opacity-75 transition-opacity" />

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="relative bg-gradient-to-tr from-[#128C7E] via-[#1EBE5D] to-[#25D366] hover:from-[#1EBE5D] hover:to-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-[0_10px_35px_rgba(37,211,102,0.45)] border-2 border-white/90 flex items-center justify-center gap-2.5 transition-all duration-300 transform group-hover:scale-110 active:scale-95"
            aria-label="Chat with The Cometas on WhatsApp"
            title="Chat with Us on WhatsApp"
          >
            <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 fill-white shrink-0 drop-shadow" />

            {/* Micro Live Status Dot */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-[#128C7E] rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
