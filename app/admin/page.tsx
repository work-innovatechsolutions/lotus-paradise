"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  CalendarCheck,
  Building2,
  Users,
  Inbox,
  BedDouble,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const metrics = [
    { title: "Monthly Revenue", value: formatPrice(384000), change: "+18.4% vs last mo", icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
    { title: "Occupancy Rate", value: "84.2%", change: "+6.1% this week", icon: <BedDouble className="w-5 h-5 text-[#C89D45]" /> },
    { title: "Pending Bookings", value: "3 Requests", change: "Requires confirmation", icon: <Clock className="w-5 h-5 text-amber-400" /> },
    { title: "Check-ins Today", value: "2 Guests", change: "Arriving after 1:00 PM", icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> },
    { title: "Upcoming Guests", value: "8 Bookings", change: "Next 7 Days", icon: <CalendarCheck className="w-5 h-5 text-sky-400" /> },
    { title: "Corporate Leads", value: "2 High Priority", change: "Tech & Consulting offsites", icon: <Building2 className="w-5 h-5 text-[#C62828]" /> },
    { title: "Customer Enquiries", value: "5 Unread", change: "Latpanchar package info", icon: <Inbox className="w-5 h-5 text-purple-400" /> },
    { title: "Total Guests Served", value: "142 Families", change: "This Season", icon: <Users className="w-5 h-5 text-amber-300" /> },
  ];

  const recentBookings = [
    { id: "LPH-849201", guest: "Anirban Roy", room: "Kanchenjunga Deluxe Suite", dates: "15 Aug - 18 Aug 2026", amount: 14400, status: "CONFIRMED" },
    { id: "LPH-710294", guest: "Dr. Richard Miller", room: "Heritage Family Suite", dates: "20 Aug - 23 Aug 2026", amount: 19500, status: "PENDING" },
    { id: "LPH-639102", guest: "Swati Sengupta", room: "Colonial Couple Retreat", dates: "25 Aug - 27 Aug 2026", amount: 7800, status: "CONFIRMED" },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Lotus Paradise Control Hub
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Executive Performance Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest shadow-md border border-[#C89D45]/40 flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4 text-[#C89D45]" />
            <span>Manage Bookings</span>
          </Link>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-[#2C2473] p-5 rounded-2xl border border-[#C89D45]/30 space-y-3 shadow-xl hover:border-[#C89D45] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-accent uppercase text-gray-300 font-semibold">{m.title}</span>
              <div className="p-2 rounded-xl bg-black/30 border border-white/10">{m.icon}</div>
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">{m.value}</h3>
            <p className="text-[11px] font-sans text-gray-400">{m.change}</p>
          </div>
        ))}
      </div>

      {/* RECENT BOOKINGS TABLE & TIMELINE */}
      <div className="bg-[#2C2473] rounded-3xl p-6 md:p-8 border border-[#C89D45]/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-white">
            Recent Reservation Activity
          </h3>
          <Link
            href="/admin/bookings"
            className="text-xs font-accent uppercase text-[#C89D45] hover:text-white font-bold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-accent uppercase text-[10px]">
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Guest Name</th>
                <th className="pb-3">Suite Reserved</th>
                <th className="pb-3">Stay Dates</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-gray-200">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#C89D45]">{b.id}</td>
                  <td className="py-3.5 font-semibold text-white">{b.guest}</td>
                  <td className="py-3.5">{b.room}</td>
                  <td className="py-3.5">{b.dates}</td>
                  <td className="py-3.5 font-bold">{formatPrice(b.amount)}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-accent font-bold uppercase ${
                        b.status === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
