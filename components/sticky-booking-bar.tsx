"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ArrowRight, Mountain } from "lucide-react";

export default function StickyBookingBar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin") || pathname === "/booking" || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 py-3 px-4 shadow-2xl border-t border-[#C89D45]/30"
      style={{
        background: `
          radial-gradient(ellipse 80% 100% at 0% 50%, rgba(198,40,40,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 60% 100% at 100% 50%, rgba(200,157,69,0.08) 0%, transparent 60%),
          linear-gradient(135deg, #FBF8F3 0%, #FFF4EE 50%, #FBF8F3 100%)
        `,
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
      }}
    >
      {/* Gold shimmer top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] gold-shimmer-bg"
        style={{ backgroundSize: "200% 100%" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <div className="p-2 rounded-xl shadow-sm border border-[#C89D45]/30" style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}>
            <Mountain className="w-5 h-5 text-[#C89D45]" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-[#1F1F1F] leading-tight">
              Lotus Paradise Himalayan Retreat
            </h4>
            <p className="text-xs font-accent text-[#C62828] font-semibold">
              Latpanchar • Rooms from ₹3,900 / Night
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-accent uppercase tracking-wider text-[#555] font-semibold sm:hidden">
            Lotus Paradise Homestay
          </span>
          <Link
            href="/booking"
            className="btn-luxury text-white px-6 py-2.5 rounded-full font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md border border-[#C89D45]/40 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
          >
            <Calendar className="w-4 h-4 text-[#C89D45] relative z-10" />
            <span className="relative z-10">Book Your Stay</span>
            <ArrowRight className="w-4 h-4 text-white relative z-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}
