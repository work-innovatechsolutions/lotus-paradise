"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Check,
  Lock,
  Unlock,
  Shield,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Image as ImageIcon,
  Compass,
  Inbox,
  Bed,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { PanelLockService, type AdminPanelLockConfig } from "@/services/panel-lock.service";

const ADMIN_MENU_ITEMS = [
  { id: "dashboard", name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
  { id: "hero-slides", name: "Hero Banner Manager", href: "/admin/hero-slides", icon: Layers },
  { id: "bookings", name: "Bookings & Calendar", href: "/admin/bookings", icon: CalendarCheck },
  { id: "corporate", name: "Corporate Leads", href: "/admin/corporate-leads", icon: Building2 },
  { id: "rooms", name: "Rooms Management", href: "/admin/rooms", icon: Bed },
  { id: "gallery", name: "Gallery & SEO Alt", href: "/admin/gallery", icon: ImageIcon },
  { id: "experiences", name: "Experiences", href: "/admin/experiences", icon: Compass },
  { id: "enquiries", name: "Customer Enquiries", href: "/admin/enquiries", icon: Inbox },
  { id: "settings", name: "Website Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "The Cometas",
    tagline: "A Luxury Himalayan Homestay in Latpanchar",
    phone1: "+91 98320 12345",
    phone2: "+91 94340 67890",
    whatsappNumber: "+919832012345",
    email: "stay@lotusparadisehomestay.com",
    address: "Upper Latpanchar Forest Road, Kurseong Division, West Bengal - 734008",
    seoKeywords: "Latpanchar Homestay, Rufous-necked Hornbill, Kanchenjunga View, Sittong Orange Orchards",
  });

  // Panel Lock Passcode State
  const [lockConfig, setLockConfig] = useState<AdminPanelLockConfig>({
    enabled: false,
    passcode: "1234",
    lockedRoutes: [],
  });

  const [showPin, setShowPin] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lockSaved, setLockSaved] = useState(false);

  useEffect(() => {
    // Load existing settings if saved in localStorage
    try {
      const savedGeneral = localStorage.getItem("lp_general_settings");
      if (savedGeneral) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedGeneral) }));
      }
    } catch (e) {
      console.error(e);
    }

    // Load Panel Lock Config
    const config = PanelLockService.getConfig();
    setLockConfig(config);
  }, []);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("lp_general_settings", JSON.stringify(settings));
    } catch (err) {
      console.error(err);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveLockConfig = (e: React.FormEvent) => {
    e.preventDefault();
    PanelLockService.saveConfig(lockConfig);
    setLockSaved(true);
    setTimeout(() => setLockSaved(false), 3000);
  };

  const toggleRouteLock = (routeHref: string) => {
    setLockConfig((prev) => {
      const isLocked = prev.lockedRoutes.includes(routeHref);
      const newLocked = isLocked
        ? prev.lockedRoutes.filter((r) => r !== routeHref)
        : [...prev.lockedRoutes, routeHref];
      return {
        ...prev,
        lockedRoutes: newLocked,
      };
    });
  };

  const selectAllRoutes = () => {
    setLockConfig((prev) => ({
      ...prev,
      lockedRoutes: ADMIN_MENU_ITEMS.map((item) => item.href),
    }));
  };

  const clearAllRoutes = () => {
    setLockConfig((prev) => ({
      ...prev,
      lockedRoutes: [],
    }));
  };

  const handleLockAllNow = () => {
    PanelLockService.lockAll();
    alert("🔒 All admin menus have been locked. Navigating to any protected section will now require your security PIN.");
  };

  return (
    <div className="space-y-10 text-white max-w-4xl">
      <div>
        <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
          Configuration & Security Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Website Settings & Admin Security
        </h1>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          1. ADMIN PANEL PASSCODE & MENU LOCK CARD
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#2C2473] rounded-3xl p-6 md:p-8 border-2 border-[#C89D45] shadow-2xl space-y-6 relative overflow-hidden">
        {/* Background glow badge */}
        <div
          className="absolute -top-24 -right-24 w-60 h-60 rounded-full pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, #C89D45, transparent)" }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C89D45]/20 border border-[#C89D45]/50 flex items-center justify-center text-[#C89D45]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
                Access Control & Privacy
              </span>
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <span>Admin Panel Menu Passcode Lock</span>
                {lockConfig.enabled ? (
                  <span className="text-[10px] font-accent font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-accent font-bold px-2 py-0.5 bg-gray-500/20 text-gray-400 border border-gray-500/40 rounded-full">
                    DISABLED
                  </span>
                )}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLockAllNow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-[#C89D45]/40 text-xs font-accent font-bold text-[#C89D45] hover:bg-[#C89D45] hover:text-[#1F1F1F] transition-all"
            title="Lock active session now"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock All Now</span>
          </button>
        </div>

        {lockSaved && (
          <div className="bg-emerald-600/30 border border-emerald-500 text-emerald-200 p-4 rounded-2xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Panel lock passcode and menu configurations saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveLockConfig} className="space-y-6">
          {/* Master Enable Checkbox */}
          <div className="p-4 rounded-2xl bg-black/30 border border-[#C89D45]/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="enable-panel-lock" className="font-accent text-sm font-bold text-white flex items-center gap-2 cursor-pointer">
                {lockConfig.enabled ? <Lock className="w-4 h-4 text-[#C89D45]" /> : <Unlock className="w-4 h-4 text-gray-400" />}
                <span>Enable Passcode Protection for Admin Menus</span>
              </label>
              <p className="text-xs text-gray-300">
                When enabled, checked menus below will require entering your security PIN before they can be opened.
              </p>
            </div>
            <input
              type="checkbox"
              id="enable-panel-lock"
              checked={lockConfig.enabled}
              onChange={(e) => setLockConfig({ ...lockConfig, enabled: e.target.checked })}
              className="w-5 h-5 accent-[#C62828] cursor-pointer rounded"
            />
          </div>

          {/* Passcode / PIN Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-accent uppercase text-[#C89D45] font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" /> Security Passcode / PIN *
              </label>
              <div className="relative">
                <input
                  required
                  type={showPin ? "text" : "password"}
                  maxLength={8}
                  placeholder="Enter 4-8 digit PIN"
                  value={lockConfig.passcode}
                  onChange={(e) => setLockConfig({ ...lockConfig, passcode: e.target.value })}
                  className="w-full bg-black/40 border border-[#C89D45]/40 rounded-xl p-3 pr-10 text-sm font-mono tracking-widest text-white focus:outline-none focus:border-[#C89D45]"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C89D45] transition-colors"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400">
                Default PIN is <strong>1234</strong>. Choose a secure 4-8 digit PIN to protect sensitive menus.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block">
                Protection Status
              </label>
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Locked Menus Count:</span>
                  <span className="font-bold text-[#C89D45]">{lockConfig.lockedRoutes.length} of {ADMIN_MENU_ITEMS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Master Lock Status:</span>
                  <span className={lockConfig.enabled ? "text-emerald-400 font-bold" : "text-gray-400"}>
                    {lockConfig.enabled ? "Enabled & Active" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menus Checklist Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <label className="text-xs font-accent uppercase tracking-wider text-[#C89D45] font-bold flex items-center gap-1.5">
                <span>Select Admin Menus to Lock with Passcode:</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllRoutes}
                  className="text-[11px] font-accent text-[#C89D45] hover:underline"
                >
                  Select All
                </button>
                <span className="text-gray-500">·</span>
                <button
                  type="button"
                  onClick={clearAllRoutes}
                  className="text-[11px] font-accent text-gray-400 hover:text-white"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ADMIN_MENU_ITEMS.map((item) => {
                const isLocked = lockConfig.lockedRoutes.includes(item.href);
                const Icon = item.icon;
                return (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isLocked
                        ? "bg-[#C62828]/20 border-[#C62828] text-white shadow-md"
                        : "bg-black/30 border-white/10 text-gray-300 hover:border-[#C89D45]/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-xl ${isLocked ? "bg-[#C62828] text-white" : "bg-white/5 text-gray-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-accent text-xs font-bold leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">{item.href}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {isLocked && <Lock className="w-3.5 h-3.5 text-[#C89D45]" />}
                      <input
                        type="checkbox"
                        checked={isLocked}
                        onChange={() => toggleRouteLock(item.href)}
                        className="w-4 h-4 accent-[#C62828] cursor-pointer"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]"
            >
              <Save className="w-4 h-4 text-[#C89D45]" />
              <span>Save Passcode &amp; Menu Locks</span>
            </button>
          </div>
        </form>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. GENERAL WEBSITE & CONTACT SETTINGS
      ══════════════════════════════════════════════════════════════════════ */}
      {saved && (
        <div className="bg-emerald-600/30 border border-emerald-500 text-emerald-200 p-4 rounded-2xl flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-400" />
          <span>Website settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveGeneral} className="bg-[#2C2473] rounded-3xl p-6 md:p-8 border border-[#C89D45]/30 shadow-2xl space-y-6">
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
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C89D45]"
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
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C89D45]"
            />
          </div>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#C89D45] pt-4 border-t border-white/10">
          Contact Numbers &amp; Instant WhatsApp
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
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C89D45]"
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
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C89D45]"
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
              className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C89D45]"
            />
          </div>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#C89D45] pt-4 border-t border-white/10">
          SEO &amp; Meta Tags
        </h3>

        <div>
          <label className="text-xs font-accent uppercase text-[#C89D45] font-bold block mb-1">
            Global SEO Keywords
          </label>
          <input
            type="text"
            value={settings.seoKeywords}
            onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
            className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C89D45]"
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
