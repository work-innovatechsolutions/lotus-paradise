import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import StickyBookingBar from "@/components/sticky-booking-bar";
import AnimationProviders from "@/components/animation-providers";
import { constructMetadata, generateHotelSchema } from "@/lib/seo";
import { RoomStoreProvider } from "@/lib/room-store";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hotelSchema = generateHotelSchema();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-PYJXE8R7H2";

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
      </head>
      <body className="antialiased bg-[#FBF8F3] text-[#1F1F1F] selection:bg-[#C62828] selection:text-white">
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>

        {/* PAGE LOADER, SCROLL PROGRESS, GSAP INIT */}
        <AnimationProviders />

        <RoomStoreProvider>
          <SmoothScroll>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <StickyBookingBar />
            <FloatingWhatsApp />
          </SmoothScroll>
        </RoomStoreProvider>
      </body>
    </html>
  );
}
