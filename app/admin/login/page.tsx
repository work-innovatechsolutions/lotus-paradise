"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@lotusparadise.com");
  const [password, setPassword] = useState("luxury2026");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@lotusparadise.com" && password === "luxury2026") {
      router.push("/admin");
    } else {
      setError("Invalid credentials. Use admin@lotusparadise.com / luxury2026");
    }
  };

  return (
    <div className="min-h-screen bg-[#15103A] flex items-center justify-center p-4">
      <div className="bg-[#2C2473] rounded-3xl p-8 md:p-12 border border-[#C89D45] shadow-2xl max-w-md w-full text-white space-y-6">
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto">
            <Image
              src="/LotusParadise.png"
              alt="Lotus Paradise Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Lotus Paradise Homestay
          </span>
          <h1 className="font-serif text-3xl font-bold text-white">
            Admin Management Portal
          </h1>
          <p className="text-xs font-sans text-gray-300">
            Sign in to manage bookings, corporate leads, media gallery, and website settings.
          </p>
        </div>

        {error && (
          <div className="bg-[#C62828]/20 border border-[#C62828] text-red-200 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-[#C89D45]/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C89D45]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-accent uppercase text-[#C89D45] font-bold block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-[#C89D45]/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C89D45]"
              />
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-3 text-[11px] font-mono text-gray-300 border border-white/10">
            <span className="text-[#C89D45] font-bold block mb-1">Demo Credentials:</span>
            Email: admin@lotusparadise.com<br />
            Password: luxury2026
          </div>

          <button
            type="submit"
            className="w-full bg-[#C62828] hover:bg-[#8B1E1E] text-white py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg border border-[#C89D45]/50 transition-transform hover:scale-[1.02]"
          >
            <ShieldCheck className="w-4 h-4 text-[#C89D45]" />
            <span>Sign In to Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
}
