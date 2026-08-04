"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  MapPin,
  Flame,
  VolumeX,
} from "lucide-react";

// Form validation schema with Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Refs for animations & parallax
  const bgImgRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Caps Lock detection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  // Parallax mouse movement on left screen background
  useEffect(() => {
    const container = parallaxRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xRatio = (e.clientX / innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / innerHeight - 0.5) * 2;

      const img = container.querySelector(".parallax-bg") as HTMLElement;
      if (img) {
        img.style.transform = `scale(1.08) translate(${xRatio * -12}px, ${yRatio * -12}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const runAnimations = async () => {
      const { gsap } = await import("gsap");
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        // Set all elements visible instantly
        gsap.set(
          [
            cardRef.current,
            logoRef.current,
            headingRef.current,
            subtitleRef.current,
            fieldsRef.current,
            buttonRef.current,
            footerRef.current,
            quoteRef.current,
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      // Hide elements initially
      gsap.set([logoRef.current, subtitleRef.current, buttonRef.current, footerRef.current], {
        opacity: 0,
        y: 20,
      });
      gsap.set(cardRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(quoteRef.current, { opacity: 0, x: -30 });

      if (fieldsRef.current) {
        gsap.set(fieldsRef.current.children, { opacity: 0, y: 15 });
      }

      const tl = gsap.timeline({ delay: 0.2 });

      // 1. Zoom Background slowly (Ken Burns)
      if (bgImgRef.current) {
        gsap.fromTo(
          bgImgRef.current,
          { scale: 1.15 },
          { scale: 1.0, duration: 2.2, ease: "power2.out" }
        );
      }

      // 2. Glass Card scales & fades in
      tl.to(
        cardRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "0"
      );

      // 3. Logo & Quote fade in
      tl.to(
        [logoRef.current, quoteRef.current],
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
        },
        "-=0.4"
      );

      // 4. Split Type character stagger for Heading "Welcome Back"
      if (headingRef.current) {
        const SplitType = (await import("split-type")).default;
        const split = new SplitType(headingRef.current, { types: "chars,words" });
        gsap.set(headingRef.current, { opacity: 1 });
        gsap.set(split.chars, { opacity: 0, y: 25, rotateX: -30 });

        tl.to(
          split.chars,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.5,
            ease: "back.out(1.5)",
            stagger: { amount: 0.35 },
          },
          "-=0.3"
        );
      }

      // 5. Subtitle reveal
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.25"
      );

      // 6. Inputs stagger reveal
      if (fieldsRef.current) {
        tl.to(
          fieldsRef.current.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.2"
        );
      }

      // 7. Button & Footer
      tl.to(
        [buttonRef.current, footerRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.15"
      );
    };

    runAnimations();
  }, []);

  // Form submit handler using Firebase Authentication
  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      // Attempt to sign in using Firebase Authentication
      await signInWithEmailAndPassword(auth, data.email, data.password);

      setSuccess(true);
      // Set session cookie expiring in 1 day
      document.cookie = "lp_admin_session=true; path=/; max-age=86400; SameSite=Lax";

      // Animate success transition
      const { gsap } = await import("gsap");
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 0.95,
          opacity: 0,
          y: -15,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            router.push("/admin");
          },
        });
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let friendlyMessage = "Invalid administrator credentials. Access Denied.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        friendlyMessage = "Invalid administrator credentials. Access Denied.";
      } else if (err.code === "auth/too-many-requests") {
        friendlyMessage = "Too many failed attempts. This account has been temporarily locked.";
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setErrorMsg(friendlyMessage);
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex bg-[#0A0A0F] overflow-hidden select-none font-sans"
      onKeyDown={handleKeyDown}
    >
      {/* LEFT COLUMN: CINEMATIC HILLS SunRise (60%) */}
      <div 
        ref={parallaxRef}
        className="hidden lg:flex relative w-3/5 h-screen overflow-hidden bg-black border-r border-[#C89D45]/20"
      >
        {/* Background Image Container */}
        <div
          ref={bgImgRef}
          className="absolute inset-0 w-full h-full parallax-bg origin-center"
        >
          <Image
            src="/images/hero/bengal-latpanchar.jpg.jpeg"
            alt="Himalayan Mountain Sunrise at Latpanchar"
            fill
            priority
            className="object-cover object-center filter brightness-[0.7] saturate-[0.85]"
          />
        </div>

        {/* Ambient Overlay Layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/35 to-transparent z-10" />

        {/* Layered Warm Radial Light (Sunrise emulation) */}
        <div 
          className="absolute bottom-1/4 left-1/4 w-[600px] h-[300px] rounded-full pointer-events-none z-10"
          style={{
            background: "radial-gradient(ellipse, rgba(200,157,69,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Soft Flowing Fog Overlay */}
        <div className="absolute inset-0 z-10 opacity-30 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="fog-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <rect width="100%" height="100%" filter="url(#fog-filter)" fill="rgba(255,255,255,0.02)" className="animate-fog" />
          </svg>
        </div>

        {/* Cinematic Branding and Quotes (Left Bottom Corner) */}
        <div 
          ref={quoteRef}
          className="absolute bottom-16 left-16 z-20 space-y-6 max-w-xl text-left"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-accent uppercase tracking-[0.25em] text-[#C89D45] font-bold block">
              Boutique Sanctuary
            </span>
            <p className="font-serif text-4xl sm:text-5xl font-light text-[#FBF8F3] leading-[1.25] italic italic-quotes">
              &ldquo;Come as a Guest,<br />Leave with Beautiful Memories.&rdquo;
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-accent text-white/55 tracking-wider uppercase font-semibold">
            <MapPin className="w-4 h-4 text-[#C89D45]" />
            <span>Latpanchar &bull; Darjeeling &bull; 4,500 ft</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: LUXURY LOGIN PORTAL CARD (40%) */}
      <div className="w-full lg:w-2/5 min-h-screen bg-[#0A0A0F] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle decorative lights */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#C89D45]/5 filter blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#C62828]/5 filter blur-[80px] pointer-events-none" />

        <div className="flex-1 flex items-center justify-center py-8">
          <div
            ref={cardRef}
            className="w-full max-w-[440px] rounded-[32px] p-6 sm:p-8 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] space-y-6 relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {/* Logo Section */}
            <div ref={logoRef} className="flex flex-col items-center text-center space-y-3">
              <div className="relative w-40 h-11">
                <Image
                  src="/LotusParadise.png"
                  alt="Lotus Paradise Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C89D45]/50 to-transparent pt-1" />
            </div>

            {/* Titles */}
            <div className="text-center space-y-1.5">
              <h1
                ref={headingRef}
                className="font-serif text-3xl font-bold text-white tracking-wide"
                style={{ opacity: 0 }}
              >
                Welcome Back
              </h1>
              <p
                ref={subtitleRef}
                className="font-sans text-xs text-gray-400 max-w-[280px] mx-auto leading-relaxed"
              >
                Sign in to access the Lotus Paradise Admin Dashboard.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-[#C62828]/15 border border-[#C62828]/50 text-red-200 text-xs p-3.5 rounded-xl text-center space-y-1 animate-pulse-ring">
                <p className="font-bold uppercase tracking-wider text-[10px] text-[#C62828]">Authentication Error</p>
                <p className="font-sans text-[11px]">{errorMsg}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
              <div ref={fieldsRef} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold tracking-widest block ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      disabled={isLoading || success}
                      placeholder="admin@lotusparadise.com"
                      {...register("email")}
                      className={`w-full bg-black/45 border rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89D45] focus:ring-2 focus:ring-[#C89D45]/20 transition-all font-sans ${
                        errors.email ? "border-[#C62828]" : "border-white/10"
                      }`}
                    />
                    <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-3.5 group-focus-within:text-[#C89D45] transition-colors" />
                  </div>
                  {errors.email && (
                    <p className="text-[10px] text-[#C62828] font-accent ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold tracking-widest block">
                      Password
                    </label>
                    <button
                      type="button"
                      tabIndex={-1}
                      className="text-[10px] font-accent text-gray-400 hover:text-[#C89D45]"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading || success}
                      placeholder="••••••••"
                      {...register("password")}
                      className={`w-full bg-black/45 border rounded-2xl pl-11 pr-11 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#C89D45] focus:ring-2 focus:ring-[#C89D45]/20 transition-all font-sans ${
                        errors.password ? "border-[#C62828]" : "border-white/10"
                      }`}
                    />
                    <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-3.5 group-focus-within:text-[#C89D45] transition-colors" />
                    
                    {/* Password toggle button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 p-0.5 rounded text-gray-500 hover:text-white transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-[#C62828] font-accent ml-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Caps Lock Detection Warning */}
                {capsLockActive && (
                  <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] px-3 py-2 rounded-xl flex items-center gap-1.5 font-accent animate-pulse">
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Warning: Caps Lock is active</span>
                  </div>
                )}

                {/* Extra Options */}
                <div className="flex items-center justify-between text-xs font-sans pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-white/10 bg-black/40 text-[#C62828] focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-[#C62828]"
                    />
                    <span>Remember Device</span>
                  </label>
                </div>
              </div>

              {/* Login Button */}
              <button
                ref={buttonRef}
                type="submit"
                disabled={isLoading || success}
                className="w-full text-white py-4 rounded-2xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg border border-[#C89D45]/30 hover:border-[#C89D45]/60 transition-transform active:scale-[0.98] overflow-hidden"
                style={{
                  background: success 
                    ? "linear-gradient(135deg, #10B981, #059669)" 
                    : "linear-gradient(135deg, #C62828 0%, #8B1E1E 100%)",
                }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : success ? (
                  <span>Verified Access...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#C89D45]" />
                    <span>Authenticate Access</span>
                  </>
                )}
              </button>
            </form>

            {/* Note box removed for production flow */}
          </div>
        </div>

        {/* Footer info */}
        <div 
          ref={footerRef}
          className="text-center font-sans text-[10px] text-gray-500 space-y-0.5 relative z-10"
        >
          <p className="font-accent font-semibold uppercase tracking-widest text-[#C89D45]/70">
            Lotus Paradise Homestay
          </p>
          <p>Latpanchar, Kurseong Hill Division, Darjeeling</p>
          <p className="opacity-60">&copy; 2026 All Rights Reserved &bull; Version v1.0</p>
        </div>
      </div>
    </div>
  );
}
