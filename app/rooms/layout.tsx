import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Luxury Mountain Rooms & Suites | The Cometas Homestays",
  description:
    "Explore our handcrafted Deluxe and Family mountain rooms at The Cometas Homestays. Featuring panoramic Kanchenjunga balconies, heated comforts, and all 4 daily meals included.",
  canonicalUrl: "https://thecometas.com/rooms",
  keywords: [
    "Latpanchar Rooms",
    "Kanchenjunga View Rooms",
    "Family Mountain Suite Darjeeling",
    "Luxury Homestay Rooms North Bengal",
    "The Cometas Suites",
  ],
});

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
