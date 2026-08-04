"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NotificationService } from "@/services/notification.service";
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
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const unread = await NotificationService.getUnreadNotifications();
    setNotifications(unread);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clear admin session cookie
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
    { name: "Experiences", href: "/admin/experiences", icon: <Compass className="w-4 h-4" /> },
    { name: "Customer Enquiries", href: "/admin/enquiries", icon: <Inbox className="w-4 h-4" /> },
    { name: "Website Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#15103A] text-white flex">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-72 bg-[#2C2473] border-r border-[#C89D45]/30 flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative w-36 h-10">
              <Image
                src="/LotusParadise.png"
                alt="Lotus Paradise Admin"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
            <span className="font-accent text-[9px] uppercase text-[#C89D45] tracking-widest">
              Admin Hub
            </span>
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-accent text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#C62828] text-white shadow-lg border border-[#C89D45]/40"
                      : "text-gray-300 hover:bg-[#1F1F1F]/40 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-[#C89D45]" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#C62828] flex items-center justify-center font-bold text-xs text-white">
              AD
            </div>
            <div>
              <p className="text-xs font-accent font-bold text-white">Homestay Admin</p>
              <p className="text-[10px] text-gray-400">Super Admin Role</p>
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

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
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
        </header>

        {/* MOBILE DRAWER */}
        {sidebarOpen && (
          <div className="lg:hidden bg-[#2C2473] p-4 border-b border-[#C89D45]/30 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-accent text-xs ${
                  pathname === item.href ? "bg-[#C62828] text-white" : "text-gray-300"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}

        <main className="p-6 md:p-10 flex-1">{children}</main>
      </div>
    </div>
  );
}
