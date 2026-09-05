"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, Phone, Lock } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollY / docHeight : 0);
      setIsScrolled(scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Property", href: "/our-properties" },
    { name: "Blogs", href: "/blog" },
    { name: "Gallery", href: "/gallery" },
    { name: "Corporate Retreats", href: "/corporate" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 shadow-cinematic"
          : "bg-gradient-to-b from-black/65 via-black/25 to-transparent py-5"
      }`}
      style={
        isScrolled
          ? {
              background: "rgba(251,248,243,0.92)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              borderBottom: "1px solid rgba(200,157,69,0.28)",
            }
          : {}
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LOGO — The Cometas */}
        <Link href="/" className="navbar-logo flex items-center group" aria-label="The Cometas Homestays">
          <div
            className={`relative transition-all duration-300 flex items-center justify-center ${
              isScrolled
                ? "w-[125px] h-[52px]"
                : "w-[145px] h-[60px] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#C89D45]/35 shadow-md group-hover:bg-white/95"
            }`}
          >
            <Image
              src="/The Cometas Logo.png"
              alt="The Cometas — Luxury Himalayan Homestay"
              fill
              priority
              className="object-contain drop-shadow-sm group-hover:scale-[1.03] transition-transform duration-300"
            />
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-accent font-medium tracking-wide transition-all duration-300 relative py-1 group ${
                  isScrolled
                    ? isActive
                      ? "text-[#C62828] font-semibold"
                      : "text-[#1F1F1F] hover:text-[#C62828]"
                    : isActive
                    ? "text-[#C89D45] font-semibold"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
                {/* Animated underline */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-400 ${
                    isScrolled ? "bg-[#C62828]" : "bg-[#C89D45]"
                  } ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            );
          })}
        </nav>

        {/* ACTION BUTTONS */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+919832012345"
            className={`flex items-center gap-1.5 text-xs font-accent tracking-wider uppercase transition-colors duration-300 ${
              isScrolled ? "text-[#1F1F1F] hover:text-[#C62828]" : "text-white/85 hover:text-white"
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>+91 98320 12345</span>
          </a>

          <Link
            href="/admin/login"
            className={`flex items-center gap-1.5 text-xs font-accent tracking-wider uppercase transition-colors duration-300 ${
              isScrolled ? "text-[#1F1F1F] hover:text-[#C62828]" : "text-white/85 hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>Admin</span>
          </Link>

          <Link
            href="/booking"
            id="navbar-book-btn"
            className={`flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-accent text-xs uppercase tracking-widest font-semibold transition-all duration-300 border border-[#C89D45]/45 btn-luxury ${
              isScrolled ? "shadow-red-glow animate-breathing-glow" : ""
            }`}
            style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
          >
            <Calendar className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>Book Now</span>
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${
            isScrolled
              ? "text-[#1F1F1F] hover:bg-[#C62828]/10"
              : "text-white hover:bg-white/10"
          }`}
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div
        id="mobile-nav"
        className={`lg:hidden overflow-hidden transition-all duration-400 ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "rgba(251,248,243,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(200,157,69,0.25)",
        }}
      >
        <div className="px-6 py-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between text-base font-accent py-3 border-b border-gray-100 transition-colors ${
                pathname === link.href
                  ? "text-[#C62828] font-bold"
                  : "text-[#1F1F1F] hover:text-[#C62828]"
              }`}
            >
              <span>{link.name}</span>
              {pathname === link.href && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C62828]" />
              )}
            </Link>
          ))}

          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-white w-full py-3.5 rounded-2xl font-accent text-sm font-semibold tracking-wider uppercase shadow-lg border border-[#C89D45]/40 btn-luxury"
              style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
            >
              <Calendar className="w-4 h-4 text-[#C89D45]" />
              <span>Book Your Stay</span>
            </Link>

            <a
              href="tel:+919832012345"
              className="flex items-center justify-center gap-2 text-[#1F1F1F] w-full py-3 rounded-2xl font-accent text-xs font-semibold tracking-widest uppercase border border-[#C89D45]/40"
            >
              <Phone className="w-3.5 h-3.5 text-[#C89D45]" />
              <span>Call Direct</span>
            </a>

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-[#1F1F1F] w-full py-3 rounded-2xl font-accent text-xs font-semibold tracking-widest uppercase border border-dashed border-[#C89D45]/40 mt-1"
            >
              <Lock className="w-3.5 h-3.5 text-[#C89D45]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
