"use client";

import React, { useState, useEffect } from "react";
import { LATPANCHAR_WEATHER } from "@/lib/data";
import { CloudSun, Eye, Mountain, Wind, ShieldCheck } from "lucide-react";

export default function WeatherWidget() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div 
      className="rounded-2xl p-6 md:p-8 border grid grid-cols-1 md:grid-cols-4 gap-6 items-center"
      style={{
        background: isMobile ? "rgba(22, 22, 26, 0.85)" : "rgba(30, 30, 35, 0.13)",
        backdropFilter: isMobile ? "none" : "blur(12px) saturate(180%)",
        WebkitBackdropFilter: isMobile ? "none" : "blur(12px) saturate(180%)",
        boxShadow: "0 30px 80px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
        borderColor: "rgba(255, 255, 255, 0.12)",
      }}
    >
      {/* ALTITUDE & LOCATION */}
      <div className="flex items-start gap-4 md:border-r border-white/10 pr-4">
        <div className="p-3 rounded-xl bg-white/10 text-[#C89D45] shrink-0 border border-white/5">
          <Mountain className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold text-white">
            Latpanchar Altitude
          </h4>
          <p className="text-xs font-accent text-[#C89D45] font-bold mt-0.5">
            {LATPANCHAR_WEATHER.altitude}
          </p>
          <p className="text-xs font-sans text-gray-300 mt-0.5">
            Mahananda Sanctuary Ridge
          </p>
        </div>
      </div>

      {/* TEMPERATURE */}
      <div className="flex items-start gap-4 md:border-r border-white/10 pr-4">
        <div className="p-3 rounded-xl bg-white/10 text-[#C89D45] shrink-0 border border-white/5">
          <CloudSun className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-white">
              {LATPANCHAR_WEATHER.temp}
            </span>
            <span className="text-xs font-accent text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
              {LATPANCHAR_WEATHER.condition}
            </span>
          </div>
          <p className="text-xs font-sans text-gray-300 mt-1 flex items-center gap-1">
            <Wind className="w-3 h-3 text-[#C89D45]" />
            <span>Air Quality: {LATPANCHAR_WEATHER.airQuality}</span>
          </p>
        </div>
      </div>

      {/* KANCHENJUNGA VISIBILITY INDEX */}
      <div className="flex items-start gap-4 md:border-r border-white/10 pr-4">
        <div className="p-3 rounded-xl bg-white/10 text-[#C89D45] shrink-0 border border-white/5">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold text-white">
            Peak Visibility
          </h4>
          <p className="text-xs font-accent text-[#C89D45] font-bold mt-0.5">
            {LATPANCHAR_WEATHER.kanchenjungaVisibility}
          </p>
          <p className="text-xs font-sans text-gray-300 mt-0.5">
            Live Horizon Forecast
          </p>
        </div>
      </div>

      {/* HOSPITABILITY BADGE */}
      <div className="flex items-center justify-start md:justify-center">
        <div 
          className="inline-flex items-center gap-2 text-white px-5 py-3 rounded-xl text-xs font-accent tracking-wider uppercase font-bold border border-[#C89D45]/40 shadow-md transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #C62828, #8B1E1E)",
          }}
        >
          <ShieldCheck className="w-4 h-4 text-[#C89D45]" />
          <span>Colonial Hospitality</span>
        </div>
      </div>
    </div>
  );
}
