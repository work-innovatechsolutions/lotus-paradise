"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Gift, Mail, Sparkles, Copy, CheckCircle, ArrowRight } from "lucide-react";

export default function DiscountPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has already dismissed or claimed the offer
    const hasSeen = localStorage.getItem("lp_welcome_discount_seen");
    if (hasSeen) return;

    // Show popup after 4 seconds (allows hero intro to finish)
    const timer = setTimeout(() => {
      setShow(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (show && modalRef.current) {
      const initAnim = async () => {
        const { gsap } = await import("gsap");
        gsap.fromTo(
          modalRef.current,
          { scale: 0.88, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.65, ease: "back.out(1.4)" }
        );
      };
      initAnim();
    }
  }, [show]);

  const handleDismiss = async () => {
    const { gsap } = await import("gsap");
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.9,
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setShow(false);
          localStorage.setItem("lp_welcome_discount_seen", "true");
        },
      });
    } else {
      setShow(false);
      localStorage.setItem("lp_welcome_discount_seen", "true");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("WELCOME15");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div 
        className="absolute inset-0 bg-black/65 backdrop-blur-[6px] transition-opacity duration-500"
        onClick={handleDismiss}
      />

      {/* Popup Container Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-[#C89D45]/45 shadow-[0_32px_64px_rgba(0,0,0,0.6)] px-6 py-8 md:p-8 z-10 flex flex-col text-center"
        style={{
          background: "linear-gradient(135deg, #16161D 0%, #0A0A0F 100%)",
        }}
      >
        {/* Shimmer Border Light */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C89D45] to-transparent animate-pulse" />

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        {!submitted ? (
          <div className="space-y-6">
            {/* Header Icon */}
            <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center border border-[#C89D45]/30 bg-gradient-to-br from-[#C62828] to-[#8B1E1E] text-[#C89D45] shadow-lg animate-bounce">
              <Gift className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-accent uppercase tracking-[0.2em] text-[#C89D45] font-bold flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C89D45]" />
                Exclusive Welcome Rate
              </span>
              <h2 className="font-serif text-3xl font-bold text-white leading-tight">
                Unlock 15% Off Your Himalayan Escape
              </h2>
              <p className="font-sans text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                Join the Lotus Paradise circle. Sign up to receive your digital discount code valid for any signature cottage or room booking.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C89D45] focus:ring-2 focus:ring-[#C89D45]/20 transition-all"
                  aria-label="Email for discount"
                />
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
              </div>

              <button
                type="submit"
                className="btn-luxury w-full text-white py-3.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#C89D45]/40 overflow-hidden shadow-md"
                style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
              >
                <span>Claim Welcome Gift</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={handleDismiss}
              className="text-[10px] font-accent text-gray-400 uppercase tracking-widest hover:text-[#C89D45] transition-colors"
            >
              No thanks, I prefer regular rates
            </button>
          </div>
        ) : (
          <div className="space-y-6 py-4 animate-fade-in">
            {/* Success Icon */}
            <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 shadow-lg">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-white">
                Welcome To The Circle
              </h2>
              <p className="font-sans text-xs text-gray-300 max-w-xs mx-auto leading-relaxed">
                Your 15% discount has been unlocked. Apply this code at checkout to claim your savings.
              </p>
            </div>

            {/* Promo Code Box */}
            <div className="bg-black/50 border border-[#C89D45]/30 rounded-2xl p-4 flex items-center justify-between gap-4 max-w-sm mx-auto">
              <div className="text-left">
                <span className="text-[10px] font-accent uppercase text-[#C89D45] font-bold tracking-widest block">
                  Promo Code
                </span>
                <span className="font-mono text-2xl font-bold text-white tracking-wider">
                  WELCOME15
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-[#C89D45] hover:bg-white/5 transition-all text-xs font-accent uppercase font-bold tracking-widest text-[#C89D45]"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleDismiss}
              className="btn-luxury w-full text-white py-3.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest border border-[#C89D45]/40 overflow-hidden shadow-md"
              style={{ background: "linear-gradient(135deg, #2C2473, #1F1F1F)" }}
            >
              Start Planning Stay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
