import React from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/hero-slider";
import QuickBookingCard from "@/components/quick-booking-card";
import WeatherWidget from "@/components/weather-widget";
import BirdsShowcase from "@/components/birds-showcase";
import SeasonalGuide from "@/components/seasonal-guide";
import ExperienceStoryCard from "@/components/experience-story-card";
import RoomShowcase from "@/components/room-showcase";
import CorporateSection from "@/components/corporate-section";
import AttractionMap from "@/components/attraction-map";
import GalleryMasonry from "@/components/gallery-masonry";
import TestimonialsSlider from "@/components/testimonials-slider";
import FAQAccordion from "@/components/faq-accordion";
import SectionReveal from "@/components/section-reveal";
import CounterStats from "@/components/counter-stats";
import MountainDivider from "@/components/mountain-divider";
import { Mountain, Flame, Feather, Utensils, Home, Compass, Camera, Wifi, Heart, ArrowRight, Calendar } from "lucide-react";

export default function HomePage() {
  const whyChooseUsCards = [
    {
      title: "Kanchenjunga Views",
      desc: "Wake up to unhindered morning vistas of snow-capped peaks right from your private veranda.",
      icon: <Mountain className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "Hornbill & Bird Paradise",
      desc: "Located inside upper Mahananda Sanctuary—prime nesting ground for Rufous-necked Hornbill.",
      icon: <Feather className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "Wood-Fired Bonfire",
      desc: "Cosy starry nights around garden bonfires with local barbecues and acoustic tunes.",
      icon: <Flame className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "Authentic Bengali Cuisine",
      desc: "Gourmet home-cooked meals prepared with organic local mountain vegetables and spices.",
      icon: <Utensils className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "Sittong Orange Orchards",
      desc: "Minutes away from Sittong's golden orange farms, waterfalls, and pine ridge walks.",
      icon: <Compass className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "Village Heritage Trails",
      desc: "Guided walks through 150-year-old Cinchona plantations and historic Latkothi bungalow.",
      icon: <Home className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "Photography Trails",
      desc: "Dedicated telephoto hides and ridge vantage points for landscape & avian photography.",
      icon: <Camera className="w-6 h-6 text-[#C89D45]" />,
    },
    {
      title: "High-Speed WiFi & Geyser",
      desc: "Seamless optical fiber connection for workcations alongside 24/7 hot water geysers.",
      icon: <Wifi className="w-6 h-6 text-[#C89D45]" />,
    },
  ];

  return (
    <div className="space-y-0 pb-12 overflow-x-hidden">
      {/* 1. CINEMATIC HERO SLIDER */}
      <HeroSlider />

      {/* 2. DUAL CARD CONTAINER WITH BACKGROUND VIDEO */}
      <section className="relative w-full overflow-hidden z-20 -mt-20 md:-mt-24 py-16 md:py-24">
        {/* Background Video */}
        <video
          src="/hotel_video2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <QuickBookingCard />
          <WeatherWidget />
        </div>
      </section>


      {/* 4. ABOUT SECTION — STORYTELLING WITH GSAP REVEALS */}
      <section className="py-28 relative overflow-hidden noise-overlay" style={{ background: "linear-gradient(180deg, #FFFDF8 0%, #F8F5EE 100%)" }}>

        {/* Floating gradient blobs — decoration */}
        <div
          className="blob-decoration absolute -top-20 -left-20 w-80 h-80 opacity-50"
          style={{ background: "radial-gradient(circle, rgba(198,40,40,0.06), transparent)" }}
          aria-hidden="true"
        />
        <div
          className="blob-decoration absolute -bottom-20 -right-20 w-96 h-96 opacity-40"
          style={{ background: "radial-gradient(circle, rgba(44,36,115,0.08), transparent)", animationDelay: "7s" }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">

            {/* LEFT — IMAGE WITH PREMIUM REVEAL */}
            <SectionReveal className="lg:col-span-6 relative" direction="up" threshold="top 95%">
              <div className="relative h-[500px] sm:h-[560px] rounded-3xl overflow-hidden shadow-cinematic border border-[#C89D45]/35 group">
                <Image
                  src="/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg"
                  alt="Lotus Paradise Veranda overlooking Kanchenjunga"
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-1000 ease-luxury"
                  style={{ transition: "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                {/* Parallax tint on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: "linear-gradient(135deg, rgba(198,40,40,0.08), rgba(44,36,115,0.08))" }}
                />
              </div>

              {/* OVERLAY BADGE — floats over image */}
              <div
                className="absolute -bottom-6 -right-2 sm:bottom-8 sm:-right-8 p-6 rounded-2xl max-w-[240px] space-y-2 border gradient-border animate-float-up"
                style={{
                  background: "rgba(251,248,243,0.95)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderColor: "rgba(200,157,69,0.5)",
                  boxShadow: "0 20px 60px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(200,157,69,0.2)",
                }}
              >
                <div className="flex items-center gap-2 text-[#C62828] font-bold text-[11px] font-accent uppercase tracking-wider">
                  <Heart className="w-4 h-4 text-[#C89D45]" />
                  <span>Colonial Darjeeling Charm</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-[#1F1F1F]">
                  Home Away From Home
                </h4>
                <p className="font-sans text-xs text-gray-600 leading-relaxed">
                  Where tranquil mountain mist meets timeless Bengali warmth.
                </p>
              </div>
            </SectionReveal>

            {/* RIGHT — CONTENT */}
            <div className="lg:col-span-6 space-y-7">
              <SectionReveal delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C62828]/8 border border-[#C62828]/20 text-[#C62828] text-xs font-accent tracking-widest uppercase font-semibold">
                  <span>Latpanchar Himalayan Retreat</span>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F] leading-[1.1]">
                  At Lotus Paradise, We Don&apos;t Simply Offer Rooms.{" "}
                  <em className="luxury-text-red not-italic">We Create Experiences.</em>
                </h2>
              </SectionReveal>

              <SectionReveal delay={0.3}>
                <p className="font-display text-xl text-[#C62828]/80 italic leading-relaxed">
                  &ldquo;Wake up to the mighty Kanchenjunga, explore untouched forests, taste authentic local cuisine, and reconnect with nature.&rdquo;
                </p>
              </SectionReveal>

              <SectionReveal delay={0.4}>
                <p className="font-sans text-base text-gray-700 leading-[1.8]">
                  Perched at an altitude of 4,500 feet in the Kurseong hill division, Lotus Paradise Homestay sits right at the edge of the upper Mahananda Wildlife Sanctuary. Designed with colonial timber aesthetics, cozy verandas, and monastery-inspired calm, our homestay invites you to leave behind urban haste.
                </p>
              </SectionReveal>

              {/* COUNTER STATS */}
              <SectionReveal delay={0.5}>
                <CounterStats />
              </SectionReveal>

              <SectionReveal delay={0.6}>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/about"
                    className="btn-luxury group relative text-white px-9 py-3.5 rounded-full font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 border border-[#C89D45]/40 overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #2C2473, #1F1F1F)" }}
                  >
                    <span className="relative z-10">Read Our Full Story</span>
                    <ArrowRight className="w-4 h-4 text-[#C89D45] relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/rooms"
                    className="btn-luxury relative border-2 border-[#C89D45] text-[#1F1F1F] hover:text-white px-9 py-3.5 rounded-full font-accent text-xs font-bold uppercase tracking-widest overflow-hidden group"
                    style={{}}
                  >
                    <span className="relative z-10 group-hover:text-white transition-colors">View Suites</span>
                    <div className="absolute inset-0 bg-gradient-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* MOUNTAIN DIVIDER — about to why-choose */}
      <MountainDivider colorAbove="#F8F5EE" colorBelow="white" />

      {/* 5. WHY CHOOSE US — LUXURY STAGGER CARDS */}
      <section className="py-28 bg-white relative overflow-hidden">
        {/* Subtle radial lighting */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(200,157,69,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionReveal className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
              Unrivalled Mountain Hospitality
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F]">
              Why Choose Lotus Paradise
            </h2>
            <p className="font-display text-lg text-gray-500 italic">
              Thoughtfully curated amenities and natural wonders designed for total relaxation.
            </p>
            {/* Gold decorative separator */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C89D45]" />
              <div className="w-2 h-2 rounded-full bg-[#C89D45]" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C89D45]" />
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUsCards.map((card, idx) => (
              <SectionReveal key={idx} delay={idx * 0.07} direction="up">
                <div
                  className="luxury-card-hover gradient-border rounded-2xl p-7 border border-[#C89D45]/20 hover:border-transparent space-y-4 group h-full"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(250,247,242,0.9) 100%)",
                    boxShadow: "0 4px 24px -8px rgba(44,36,115,0.06)",
                  }}
                >
                  <div className="p-3.5 rounded-xl inline-block border border-[#C89D45]/35 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse-ring"
                    style={{ background: "linear-gradient(135deg, #2C2473, #1F1F1F)" }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1F1F1F] group-hover:text-[#C62828] transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BIRDS SHOWCASE */}
      <BirdsShowcase />

      {/* 7. SEASONAL VISIT GUIDE */}
      <SeasonalGuide />

      {/* 8. SIGNATURE EXPERIENCES STORYTELLING */}
      <ExperienceStoryCard />

      {/* MOUNTAIN DIVIDER — transition to dark room section */}
      <MountainDivider colorAbove="#FBF8F3" colorBelow="#1F1F1F" />

      {/* 9. ROOM SHOWCASE */}
      <RoomShowcase />

      {/* 10. CORPORATE RETREAT SECTION */}
      <CorporateSection />

      {/* 11. NEARBY ATTRACTIONS & MAP */}
      <AttractionMap />

      {/* MOUNTAIN DIVIDER — transition to gallery */}
      <MountainDivider colorAbove="white" colorBelow="#111111" />

      {/* 12. GALLERY MASONRY */}
      <GalleryMasonry />

      {/* 13. TESTIMONIALS SLIDER */}
      <TestimonialsSlider />

      {/* 14. FAQ ACCORDION */}
      <FAQAccordion />
    </div>
  );
}
