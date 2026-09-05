import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Stay & Cancellation Policy | The Cometas Homestays",
  description: "Terms and conditions, guest identification rules, and cancellation policies for The Cometas Homestays in Latpanchar.",
  canonicalUrl: "https://thecometas.com/terms",
});

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 space-y-6 text-[#1F1F1F]">
      <h1 className="font-serif text-4xl font-bold">Terms of Stay & Cancellation Policy</h1>
      <p className="font-sans text-sm text-gray-600">Last updated: August 2026</p>

      <div className="space-y-4 font-sans text-sm leading-relaxed text-gray-700">
        <h3 className="font-serif text-xl font-bold text-[#1F1F1F]">1. Check-In & Check-Out</h3>
        <p>
          Standard Check-In time is 12:00 PM (Noon) and Check-Out time is 10:00 AM. Early check-in or late check-out is subject to room availability and prior notice.
        </p>

        <h3 className="font-serif text-xl font-bold text-[#1F1F1F] pt-2">2. ID Verification</h3>
        <p>
          All adult guests must present a valid government-issued photo ID (Aadhaar, Passport, Voter ID, or Driving License) at the time of check-in as mandated by West Bengal Tourism & Police guidelines.
        </p>

        <h3 className="font-serif text-xl font-bold text-[#1F1F1F] pt-2">3. Cancellation & Refund Policy</h3>
        <p>
          - Cancellations made 15 days prior to check-in: 100% refund.<br />
          - Cancellations made 7–14 days prior to check-in: 50% refund.<br />
          - Cancellations made within 7 days of check-in: Non-refundable.
        </p>

        <h3 className="font-serif text-xl font-bold text-[#1F1F1F] pt-2">4. Homestay Etiquette & Nature Conservation</h3>
        <p>
          As we are located adjacent to the Mahananda Wildlife Sanctuary core area, loud plastic littering, wildlife disturbance, and unapproved forest night treks are strictly prohibited.
        </p>
      </div>
    </div>
  );
}
