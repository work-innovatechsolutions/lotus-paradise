import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us & Directions | The Cometas Homestays",
  description:
    "Get in touch with The Cometas Homestays in Latpanchar, North Bengal. Bookings, cab pickup arrangements, WhatsApp helpline, and route directions from NJP and Bagdogra Airport.",
  canonicalUrl: "https://thecometas.com/contact",
  keywords: [
    "Contact The Cometas",
    "Latpanchar Homestay Phone Number",
    "How to reach Latpanchar",
    "The Cometas WhatsApp",
    "Latpanchar Taxi Service",
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
