"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NotificationService } from "@/services/notification.service";
import { PanelLockService } from "@/services/panel-lock.service";
import type { AdminNotification } from "@/types/notification";
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Image as ImageIcon,
  Compass,
  Inbox,
  Settings,
  LogOut,
  Bed,
  Layers,
  Bell,
  Menu,
  X,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Passcode Lock State
  const [lockVersion, setLockVersion] = useState(0);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    const handleLocksUpdate = () => {
      setLockVersion((v) => v + 1);
    };

    window.addEventListener("lp_notifications_updated", handleUpdate);
    window.addEventListener("lp_admin_locks_updated", handleLocksUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("storage", handleLocksUpdate);

    // Real-time Firestore sync for admin locks
    const unsubscribeLocks = PanelLockService.subscribeToFirestore(() => {
      setLockVersion((v) => v + 1);
    });
    PanelLockService.loadFromFirestore();

    let unsubscribeAuth = () => {};
    import("@/lib/firebase").then(({ auth }) => {
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user?.email) {
            setCurrentUserEmail(user.email);
          }
        });
      });
    });

    return () => {
      window.removeEventListener("lp_notifications_updated", handleUpdate);
      window.removeEventListener("lp_admin_locks_updated", handleLocksUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("storage", handleLocksUpdate);
      unsubscribeLocks();
      unsubscribeAuth();
    };
  }, []);

  const loadNotifications = async () => {
    const unread = await NotificationService.getUnreadNotifications();
    setNotifications(unread);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { auth } = await import("@/lib/firebase");
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } catch {}
    document.cookie = "lp_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard Overview", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Hero Banner Manager", href: "/admin/hero-slides", icon: <Layers className="w-4 h-4" /> },
    { name: "Bookings & Calendar", href: "/admin/bookings", icon: <CalendarCheck className="w-4 h-4" /> },
    { name: "Corporate Leads", href: "/admin/corporate-leads", icon: <Building2 className="w-4 h-4" /> },
    { name: "Rooms Management", href: "/admin/rooms", icon: <Bed className="w-4 h-4" /> },
    { name: "Gallery & SEO Alt", href: "/admin/gallery", icon: <ImageIcon className="w-4 h-4" /> },
    { name: "Blogs & Articles", href: "/admin/blogs", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Customer Enquiries", href: "/admin/enquiries", icon: <Inbox className="w-4 h-4" /> },
    { name: "Website Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  // Check if current route is locked
  const isCurrentRouteLocked = PanelLockService.isRouteLocked(pathname) && !PanelLockService.isRouteUnlocked(pathname);
  const currentItem = navItems.find((item) => item.href === pathname);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = PanelLockService.unlockRoute(pathname, enteredPin.trim());
    if (success) {
      setPinError("");
      setEnteredPin("");
      setLockVersion((v) => v + 1);
    } else {
      setPinError("Invalid security PIN. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-[#15103A] text-white flex overflow-hidden">
      {/* SIDEBAR DESKTOP — FIXED HEIGHT */}
      <aside className="hidden lg:flex w-72 h-screen bg-[#2C2473] border-r border-[#C89D45]/30 flex-col justify-between p-6 shrink-0 overflow-y-auto">
        <div className="space-y-8">
          <Link href="/admin" className="flex flex-col gap-2 group">
            <div className="bg-white/95 px-4 py-2.5 rounded-2xl border border-[#C89D45]/40 shadow-lg flex items-center justify-center transition-transform group-hover:scale-[1.02]">
              <div className="relative w-36 h-14">
                <Image
                  src="/The Cometas Logo.png"
                  alt="The Cometas Admin"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="font-accent text-[10px] uppercase text-[#C89D45] tracking-widest font-bold">
                Admin Portal
              </span>
              <span className="text-[9px] text-gray-400 font-mono">v2.4</span>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isLocked = PanelLockService.isRouteLocked(item.href);
              const isUnlocked = PanelLockService.isRouteUnlocked(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-accent text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-[#C62828] text-white shadow-lg border border-[#C89D45]/40"
                      : "text-gray-300 hover:bg-[#1F1F1F]/40 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={isActive ? "text-[#C89D45]" : "text-gray-400"}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>

                  {isLocked && (
                    <span
                      title={isUnlocked ? "PIN Protected (Unlocked in this session)" : "Locked with Passcode"}
                      className="shrink-0 ml-2"
                    >
                      {isUnlocked ? (
                        <Unlock className="w-3.5 h-3.5 text-emerald-400 opacity-70 group-hover:opacity-100" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#C89D45]" />
                      )}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#C62828] shrink-0 flex items-center justify-center font-bold text-xs text-white">
              {currentUserEmail ? currentUserEmail.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-accent font-bold text-white truncate">
                {currentUserEmail ? currentUserEmail.split("@")[0] : "Homestay Admin"}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {currentUserEmail || "Super Admin"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-600/20 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA — INDEPENDENT SCROLL */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-y-auto">
        {/* TOP BAR WITH NOTIFICATION BELL */}
        <header className="bg-[#2C2473] border-b border-[#C89D45]/30 p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="font-serif text-lg font-bold hidden sm:block">
              Lotus Paradise Admin Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2.5 rounded-xl bg-black/30 border border-[#C89D45]/30 text-white relative hover:bg-white/10 transition-colors"
              >
                <Bell className="w-5 h-5 text-[#C89D45]" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C62828] text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#2C2473]">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-[#2C2473] rounded-2xl p-4 border border-[#C89D45] shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="font-serif text-sm font-bold text-white">Live Notifications</h4>
                    <button
                      onClick={async () => {
                        await NotificationService.markAllRead();
                        await loadNotifications();
                      }}
                      className="text-[10px] font-accent text-[#C89D45] hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 py-2 text-center">No unread notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.detailsUrl || "/admin"}
                          onClick={() => setShowNotifMenu(false)}
                          className="block bg-black/30 p-2.5 rounded-xl border border-white/10 hover:border-[#C89D45] transition-colors"
                        >
                          <p className="text-xs font-sans text-gray-200">{n.title}</p>
                          <span className="text-[9px] text-[#C89D45] font-accent font-bold uppercase block mt-1">
                            {n.type}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {sidebarOpen && (
          <div className="lg:hidden bg-[#2C2473] p-4 border-b border-[#C89D45]/30 space-y-2">
            {navItems.map((item) => {
              const isLocked = PanelLockService.isRouteLocked(item.href);
              const isUnlocked = PanelLockService.isRouteUnlocked(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-accent text-xs ${
                    pathname === item.href ? "bg-[#C62828] text-white" : "text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {isLocked && (
                    <span>
                      {isUnlocked ? (
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#C89D45]" />
                      )}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* MAIN BODY: PIN LOCK GUARD OR CONTENT */}
        <main className="p-6 md:p-10 flex-1">
          {isCurrentRouteLocked ? (
            <div className="max-w-md mx-auto my-12 animate-in zoom-in-95 duration-300">
              <div className="bg-[#2C2473] rounded-3xl p-8 border-2 border-[#C89D45] shadow-2xl space-y-6 text-center relative overflow-hidden">
                {/* Background glow */}
                <div
                  className="absolute -top-20 -right-20 w-44 h-44 rounded-full pointer-events-none opacity-20"
                  style={{ background: "radial-gradient(circle, #C89D45, transparent)" }}
                />

                <div className="w-16 h-16 rounded-full bg-[#C62828]/20 border-2 border-[#C89D45] text-[#C89D45] flex items-center justify-center mx-auto shadow-lg shadow-red-900/30">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
                    Security Passcode Protection
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    {currentItem?.name || "Protected Menu"}
                  </h2>
                  <p className="text-xs text-gray-300">
                    This section is passcode protected. Please enter your security PIN to unlock and view this menu.
                  </p>
                </div>

                {pinError && (
                  <div className="bg-red-500/20 border border-red-500 text-red-200 text-xs p-3 rounded-xl flex items-center justify-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{pinError}</span>
                  </div>
                )}

                <form onSubmit={handleUnlockSubmit} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-accent uppercase text-[#C89D45] font-bold block">
                      Enter Security PIN:
                    </label>
                    <input
                      autoFocus
                      type="password"
                      maxLength={8}
                      placeholder="••••"
                      value={enteredPin}
                      onChange={(e) => {
                        setEnteredPin(e.target.value);
                        setPinError("");
                      }}
                      className="w-full bg-black/50 border-2 border-[#C89D45]/40 focus:border-[#C89D45] rounded-2xl py-3 px-4 text-center text-2xl tracking-[0.4em] font-mono text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-luxury w-full text-white py-3.5 rounded-2xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#C89D45]/50 shadow-lg"
                    style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
                  >
                    <KeyRound className="w-4 h-4 text-[#C89D45]" />
                    <span>Unlock Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-2 border-t border-white/10">
                  <Link
                    href="/admin"
                    className="text-xs font-accent text-gray-400 hover:text-[#C89D45] transition-colors inline-block"
                  >
                    Return to Dashboard Overview
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
