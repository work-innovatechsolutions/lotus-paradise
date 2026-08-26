"use client";

import React, { useState, useEffect } from "react";
import { WeatherService, type LiveWeatherData } from "@/services/weather.service";
import {
  CloudSun,
  Sun,
  CloudRain,
  CloudFog,
  CloudLightning,
  Snowflake,
  Eye,
  Mountain,
  Wind,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function WeatherWidget() {
  const [isMobile, setIsMobile] = useState(false);
  const [weather, setWeather] = useState<LiveWeatherData>({
    temp: 16,
    feelsLike: 15,
    condition: "Pleasant Mountain Breeze",
    weatherCode: 1,
    humidity: 68,
    windSpeed: 5,
    visibilityPercentage: 92,
    visibilityText: "92% Clear Sunrise Expected",
    airQuality: "Pristine (AQI 14)",
    altitude: "4,500 ft (1,371m)",
    location: "Latpanchar, Kurseong Division",
    lastUpdated: "Just now",
    isLive: true,
  });
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const data = await WeatherService.getLiveLatpancharWeather();
      setWeather(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    // Re-fetch weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);

    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-6 h-6 text-amber-300 animate-spin-slow" />;
    if (code <= 2) return <CloudSun className="w-6 h-6 text-amber-300" />;
    if (code === 3) return <CloudSun className="w-6 h-6 text-gray-300" />;
    if (code === 45 || code === 48) return <CloudFog className="w-6 h-6 text-blue-200" />;
    if (code >= 51 && code <= 65) return <CloudRain className="w-6 h-6 text-blue-300" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-6 h-6 text-cyan-200" />;
    if (code >= 95) return <CloudLightning className="w-6 h-6 text-amber-400" />;
    return <CloudSun className="w-6 h-6 text-amber-300" />;
  };

  return (
    <div 
      className="rounded-2xl p-6 md:p-8 border grid grid-cols-1 md:grid-cols-4 gap-6 items-center relative overflow-hidden transition-all duration-300"
      style={{
        background: isMobile ? "rgba(22, 22, 26, 0.88)" : "rgba(30, 30, 35, 0.20)",
        backdropFilter: isMobile ? "none" : "blur(14px) saturate(180%)",
        WebkitBackdropFilter: isMobile ? "none" : "blur(14px) saturate(180%)",
        boxShadow: "0 30px 80px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
        borderColor: "rgba(200, 157, 69, 0.3)",
      }}
    >
      {/* ALTITUDE & LOCATION */}
      <div className="flex items-start gap-4 md:border-r border-white/10 pr-4">
        <div className="p-3 rounded-xl bg-white/10 text-[#C89D45] shrink-0 border border-white/5 shadow-inner">
          <Mountain className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold text-white flex items-center gap-1.5">
            <span>Latpanchar Altitude</span>
          </h4>
          <p className="text-xs font-accent text-[#C89D45] font-bold mt-0.5">
            {weather.altitude}
          </p>
          <p className="text-xs font-sans text-gray-300 mt-0.5">
            Mahananda Sanctuary Ridge
          </p>
        </div>
      </div>

      {/* LIVE TEMPERATURE */}
      <div className="flex items-start gap-4 md:border-r border-white/10 pr-4">
        <div className="p-3 rounded-xl bg-white/10 text-[#C89D45] shrink-0 border border-white/5 shadow-inner">
          {getWeatherIcon(weather.weatherCode)}
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-serif text-3xl font-bold text-white tracking-tight">
              {weather.temp}°C
            </span>
            <span className="text-[11px] font-accent text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 truncate max-w-[140px] sm:max-w-none">
              {weather.condition}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs font-sans text-gray-300">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-[#C89D45]" />
              <span>{weather.windSpeed} km/h</span>
            </span>
            <span className="text-gray-500">·</span>
            <span>{weather.airQuality}</span>
          </div>
        </div>
      </div>

      {/* KANCHENJUNGA VISIBILITY INDEX */}
      <div className="flex items-start gap-4 md:border-r border-white/10 pr-4">
        <div className="p-3 rounded-xl bg-white/10 text-[#C89D45] shrink-0 border border-white/5 shadow-inner">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold text-white flex items-center gap-1.5">
            <span>Peak Visibility</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </h4>
          <p className="text-xs font-accent text-[#C89D45] font-bold mt-0.5">
            {weather.visibilityText}
          </p>
          <p className="text-[11px] font-sans text-gray-400 mt-0.5 flex items-center gap-1">
            <span>Live Satellite Forecast</span>
          </p>
        </div>
      </div>

      {/* HOSPITALITY BADGE & REFRESH */}
      <div className="flex items-center justify-between md:justify-center gap-3">
        <div 
          className="inline-flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-xs font-accent tracking-wider uppercase font-bold border border-[#C89D45]/40 shadow-md transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #C62828, #8B1E1E)",
          }}
        >
          <ShieldCheck className="w-4 h-4 text-[#C89D45]" />
          <span>Colonial Hospitality</span>
        </div>

        <button
          type="button"
          onClick={fetchWeather}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10 transition-all"
          title={`Click to refresh live weather (Last updated: ${weather.lastUpdated})`}
        >
          <RefreshCw className={`w-4 h-4 text-[#C89D45] ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}
