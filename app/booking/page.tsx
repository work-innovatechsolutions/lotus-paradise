"use client";

import React, { Suspense, useEffect } from "react";
import ReservationEngine from "@/components/reservation-engine";

export default function BookingPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <Suspense fallback={<div className="text-center py-20 text-gray-500 font-accent">Loading reservation engine...</div>}>
        <ReservationEngine />
      </Suspense>
    </div>
  );
}
