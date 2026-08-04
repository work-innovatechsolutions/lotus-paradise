"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, Send, Compass, ShieldCheck, Instagram, Facebook, Youtube } from "lucide-react";
import SectionReveal from "./section-reveal";

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer
      className="relative pt-20 pb-10 overflow-hidden"
      style={{
        /* Warm ivory → blush rose → soft gold — light, airy, premium */
        background: `
          radial-gradient(ellipse 70% 60% at 10% 90%, rgba(198,40,40,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 90% 10%, rgba(200,157,69,0.12) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 50% 100%, rgba(44,36,115,0.05) 0%, transparent 60%),
          linear-gradient(160deg, #FBF8F3 0%, #FFF4EE 25%, #FFF8F0 50%, #F9F5FF 75%, #FBF8F3 100%)
        `,
        color: "#1F1F1F",
      }}
    >
      {/* ANIMATED GOLD TOP BORDER */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] gold-shimmer-bg"
        style={{ backgroundSize: "200% 100%" }}
      />

      {/* SUBTLE TEXTURE LINES */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(200,157,69,0.5) 40px, rgba(200,157,69,0.5) 41px)",
        }}
        aria-hidden="true"
      />

      {/* SOFT GLOW ORBS */}
      <div
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(200,157,69,0.1), transparent)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(198,40,40,0.07), transparent)",
          filter: "blur(50px)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* BRAND COLUMN */}
          <SectionReveal className="lg:col-span-4 space-y-5" direction="up">
            <Link href="/" className="flex items-center group">
              <div className="relative w-44 h-12 group-hover:scale-[1.03] transition-transform duration-300">
                <Image
                  src="/LotusParadise.png"
                  alt="Lotus Paradise Homestay — Village Latpanchar, Sitong, Darjeeling"
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>
            </Link>

            <p className="font-display text-sm italic text-[#555] leading-relaxed max-w-sm">
              &ldquo;A luxury Himalayan homestay blending colonial Darjeeling charm, monastery-inspired calm, and authentic Bengali hospitality.&rdquo;
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-[11px] font-accent uppercase font-bold tracking-widest px-3 py-1.5 rounded-full text-white shadow-sm"
                style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
              >
                Altitude 4,500 Ft
              </span>
              <span className="text-xs font-sans text-[#C62828] flex items-center gap-1 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#C89D45]" />
                Government Verified Homestay
              </span>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: <Instagram className="w-4 h-4" />, href: "#", label: "Instagram" },
                { icon: <Facebook className="w-4 h-4" />, href: "#", label: "Facebook" },
                { icon: <Youtube className="w-4 h-4" />, href: "#", label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#888] border border-[#C89D45]/30 hover:bg-[#C62828] hover:text-white hover:border-[#C62828] hover:scale-110 transition-all duration-300 bg-white/60"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </SectionReveal>

          {/* QUICK LINKS */}
          <SectionReveal className="lg:col-span-2 space-y-4" delay={0.1}>
            <h4 className="font-serif text-lg font-bold text-[#1F1F1F] uppercase tracking-wider relative">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#C62828] to-transparent" />
            </h4>
            <ul className="space-y-2.5 text-xs font-accent text-[#555] tracking-wide">
              {[
                { name: "Home", href: "/" },
                { name: "Rooms & Suites", href: "/rooms" },
                { name: "Signature Experiences", href: "/experiences" },
                { name: "Photo Gallery", href: "/gallery" },
                { name: "Corporate Offsites", href: "/corporate" },
                { name: "About Our Story", href: "/about" },
                { name: "Contact & Map", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#C62828] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 h-px bg-[#C62828] group-hover:w-3 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </SectionReveal>

          {/* POPULAR ACTIVITIES */}
          <SectionReveal className="lg:col-span-3 space-y-4" delay={0.2}>
            <h4 className="font-serif text-lg font-bold text-[#1F1F1F] uppercase tracking-wider relative">
              Popular Activities
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#C62828] to-transparent" />
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#555]">
              {[
                "Rufous-necked Hornbill Birding Trail",
                "Sittong Orange Harvest Tour",
                "Ahaldhara Stargazing & Bonfire",
                "Latkothi Heritage Cinchona Walk",
                "Kanchenjunga Sunrise Photography",
              ].map((activity) => (
                <li key={activity} className="flex items-start gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#C62828] mt-0.5 shrink-0" />
                  <span>{activity}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href="/booking"
                className="btn-luxury inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-accent text-xs uppercase font-bold tracking-widest border border-[#C89D45]/40 overflow-hidden shadow-md"
                style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
              >
                <span className="relative z-10">Direct Booking Engine</span>
              </Link>
            </div>
          </SectionReveal>

          {/* CONTACT & NEWSLETTER */}
          <SectionReveal className="lg:col-span-3 space-y-5" delay={0.3}>
            <h4 className="font-serif text-lg font-bold text-[#1F1F1F] uppercase tracking-wider relative">
              Reach Our Desk
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#C62828] to-transparent" />
            </h4>
            <ul className="space-y-3 text-xs font-sans text-[#555]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C62828] shrink-0 mt-0.5" />
                <span>Upper Latpanchar, Kurseong Division, Darjeeling District, West Bengal - 734008</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C89D45] shrink-0" />
                <a href="tel:+919832012345" className="hover:text-[#C62828] transition-colors">
                  +91 98320 12345 / +91 94340 67890
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C89D45] shrink-0" />
                <a href="mailto:stay@lotusparadisehomestay.com" className="hover:text-[#C62828] transition-colors break-all">
                  stay@lotusparadisehomestay.com
                </a>
              </li>
            </ul>

            {/* NEWSLETTER */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-accent uppercase text-[#C62828] font-bold block tracking-widest">
                Seasonal Offer Newsletter
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/70 border border-[#C89D45]/40 rounded-xl px-3.5 py-2.5 text-xs font-sans text-[#1F1F1F] placeholder-gray-400 focus:outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/10 transition-all"
                  aria-label="Newsletter email input"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl hover:bg-[#8B1E1E] transition-all hover:scale-110 shrink-0 border border-[#C89D45]/40 shadow-sm"
                  style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-600 font-accent animate-fade-in-up font-semibold">
                  ✓ Subscribed! Expect seasonal updates soon.
                </p>
              )}
            </div>
          </SectionReveal>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-[#C89D45]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#888]">
          <p>© {new Date().getFullYear()} Lotus Paradise Homestay. All Rights Reserved.</p>
          <div className="flex items-center space-x-6 font-accent text-[11px] tracking-wider uppercase">
            <Link href="/privacy-policy" className="hover:text-[#C62828] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#C62828] transition-colors">
              Terms of Stay
            </Link>
            <Link href="/admin/login" className="hover:text-[#C62828] transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
