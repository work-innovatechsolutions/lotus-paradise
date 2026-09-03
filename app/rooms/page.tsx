"use client";

import React, { Suspense } from "react";
import ReservationEngine from "@/components/reservation-engine";

export default function RoomsPage() {
  return (
    <div className="pt-28 pb-16 min-h-screen">
      <Suspense fallback={<div className="text-center py-20 text-gray-500 font-accent">Loading accommodations &amp; reservation engine...</div>}>
        <ReservationEngine />
      </Suspense>
    </div>
  );
}
