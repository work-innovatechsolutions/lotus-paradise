"use client";

import React, { useState } from "react";
import { Settings, Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Lotus Paradise Homestay",
    tagline: "A Luxury Himalayan Homestay in Latpanchar",
    phone1: "+91 98320 12345",
    phone2: "+91 94340 67890",
    whatsappNumber: "+919832012345",
    email: "stay@lotusparadisehomestay.com",
    address: "Upper Latpanchar Forest Road, Kurseong Division, West Bengal - 734008",
    seoKeywords: "Latpanchar Homestay, Rufous-necked Hornbill, Kanchenjunga View, Sittong Orange Orchards",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 text-white max-w-4xl">
      <div>
        <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
          Configuration & Content Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Website Settings & Theme Manager
        </h1>
      </div>

      {saved && (
        <div className="bg-emerald-600/30 border border-emerald-500 text-emerald-200 p-4 rounded-2xl flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-400" />
          <span>Website settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#2C2473] rounded-3xl p-6 md:p-8 border border-[#C89D45]/30 shadow-2xl space-y-6">
        <h3 className="font-serif text-2xl font-bold text-[#C89D45]">
          General Homestay Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
              Homestay Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white"
            />
          </div>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#C89D45] pt-4 border-t border-white/10">
          Contact Numbers & Instant WhatsApp
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
              Phone Number 1
            </label>
            <input
              type="text"
              value={settings.phone1}
              onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
              WhatsApp Direct Number
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white"
            />
          </div>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#C89D45] pt-4 border-t border-white/10">
          SEO & Meta Tags
        </h3>

        <div>
          <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
            Global SEO Keywords
          </label>
          <input
            type="text"
            value={settings.seoKeywords}
            onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
            className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]"
          >
            <Save className="w-4 h-4 text-[#C89D45]" />
            <span>Save Global Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
