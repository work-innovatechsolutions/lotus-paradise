import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Our Mountain Properties & Retreats | The Cometas Homestays",
  description:
    "Discover the boutique properties in The Cometas collection: Lotus Paradise in Latpanchar (4,500 ft) and Chu & Isultim. Exceptional hospitality, organic dining, and mountain tranquility.",
  canonicalUrl: "https://thecometas.com/our-properties",
  keywords: [
    "The Cometas Properties",
    "Lotus Paradise Latpanchar",
    "Chu & Isultim Homestay",
    "North Bengal Mountain Retreats",
    "Kurseong Homestay Collection",
  ],
});

export default function OurPropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
