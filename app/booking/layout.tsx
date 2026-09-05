import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Online Room Booking & Tariffs | The Cometas Homestays",
  description:
    "Book your luxury stay at The Cometas Homestays in Latpanchar, North Bengal. Choose between Lotus Paradise and Chu & Isultim with all 4 daily meals included (Standard & Premium packages).",
  canonicalUrl: "https://thecometas.com/booking",
  keywords: [
    "Book Latpanchar Homestay",
    "The Cometas Homestays Booking",
    "Lotus Paradise Room Tariff",
    "Chu & Isultim Online Reservation",
    "North Bengal Homestay Packages",
  ],
});

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
