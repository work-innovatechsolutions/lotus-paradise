"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { BookingService } from "@/services/booking.service";
import type { Booking } from "@/types/booking";
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
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadData = async () => {
    const data = await BookingService.getAllBookings();
    setBookings(data);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("lp_bookings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("lp_bookings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => (b.status !== "CANCELLED" ? sum + (b.totalAmount || 0) : sum), 0);
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const totalGuestsCount = bookings.reduce((sum, b) => sum + (b.guestsCount || 1), 0);

  const metrics = [
    {
      title: "Total Booking Revenue",
      value: formatPrice(totalRevenue),
      change: `${bookings.length} Total Reservations`,
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: "Confirmed Stays",
      value: `${confirmedCount} Bookings`,
      change: "Active & Guaranteed",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: "Pending Requests",
      value: `${pendingCount} Requests`,
      change: pendingCount > 0 ? "Requires confirmation" : "All cleared",
      icon: <Clock className="w-5 h-5 text-amber-400" />,
    },
    {
      title: "Total Guests Booked",
      value: `${totalGuestsCount} Guests`,
      change: "Across all properties",
      icon: <Users className="w-5 h-5 text-amber-300" />,
    },
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8 text-white">
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
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">
              Recent Reservation Activity
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Live synchronized bookings across all Lotus Paradise properties
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-accent uppercase text-[#C89D45] hover:text-white font-bold flex items-center gap-1"
          >
            <span>View All ({bookings.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentBookings.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="font-serif text-lg">No reservations recorded yet.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-accent uppercase text-[10px]">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Guest Name</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Room Reserved</th>
                  <th className="pb-3">Stay Dates</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-gray-200">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#C89D45]">{b.bookingNumber}</td>
                    <td className="py-3.5 font-semibold text-white">{b.guestName}</td>
                    <td className="py-3.5 text-gray-300">
                      <div>{b.phone}</div>
                      <div className="text-[10px] text-gray-500">{b.email}</div>
                    </td>
                    <td className="py-3.5">{b.roomTitle}</td>
                    <td className="py-3.5 font-mono text-[11px]">
                      {b.checkIn} → {b.checkOut} ({b.nights}n)
                    </td>
                    <td className="py-3.5 font-bold text-[#F3D27A]">{formatPrice(b.totalAmount)}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-accent font-bold uppercase ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : b.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
