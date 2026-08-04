import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import StickyBookingBar from "@/components/sticky-booking-bar";
import AnimationProviders from "@/components/animation-providers";
import { constructMetadata, generateHotelSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hotelSchema = generateHotelSchema();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
      </head>
      <body className="antialiased bg-[#FBF8F3] text-[#1F1F1F] selection:bg-[#C62828] selection:text-white">
        {/* PAGE LOADER, SCROLL PROGRESS, GSAP INIT */}
        <AnimationProviders />

        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <StickyBookingBar />
          <FloatingWhatsApp />
        </SmoothScroll>
      </body>
    </html>
  );
}
