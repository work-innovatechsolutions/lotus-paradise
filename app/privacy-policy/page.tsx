import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy | The Cometas Homestays",
  description: "Privacy policy and data protection practices for guests of The Cometas Homestays in Latpanchar, North Bengal.",
  canonicalUrl: "https://thecometas.com/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 space-y-6 text-[#1F1F1F]">
      <h1 className="font-serif text-4xl font-bold">Privacy Policy</h1>
      <p className="font-sans text-sm text-gray-600">Last updated: August 2026</p>

      <div className="space-y-4 font-sans text-sm leading-relaxed text-gray-700">
        <p>
          At Lotus Paradise Homestay (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we are committed to respecting your privacy and protecting any personal information you provide when visiting our website or reserving accommodations in Latpanchar, North Bengal.
        </p>

        <h3 className="font-serif text-xl font-bold text-[#1F1F1F] pt-2">1. Information We Collect</h3>
        <p>
          When you make a reservation or enquiry, we collect your name, email address, phone number, check-in/out dates, and any special dietary or travel requests.
        </p>

        <h3 className="font-serif text-xl font-bold text-[#1F1F1F] pt-2">2. How We Use Your Data</h3>
        <p>
          We use your information strictly to process room bookings, arrange sightseeing or cab pickups, communicate stay confirmation details, and comply with local police registration regulations for homestays in Darjeeling district.
        </p>

        <h3 className="font-serif text-xl font-bold text-[#1F1F1F] pt-2">3. Third-Party Sharing</h3>
        <p>
          We do not sell, rent, or lease your personal information to third parties. Data is shared only with authorized local drivers or naturalists assigned to your tour upon your explicit request.
        </p>
      </div>
    </div>
  );
}
