"use client";

import React, { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { BookingService } from "@/services/booking.service";
import { GoogleSheetService } from "@/services/google-sheet.service";
import type { Booking, BookingStatus } from "@/types/booking";
import { Download, Search, CheckCircle2, Clock, XCircle, FileText, UserCheck, LogOut as LogOutIcon, FileSpreadsheet, RefreshCw } from "lucide-react";

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [syncingSheet, setSyncingSheet] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    loadBookings();

    const handleUpdate = () => {
      loadBookings();
    };

    window.addEventListener("lp_bookings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("lp_bookings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const loadBookings = async () => {
    const data = await BookingService.getAllBookings();
    setBookings(data);
  };

  const updateStatus = async (id: string, newStatus: BookingStatus) => {
    await BookingService.updateBookingStatus(id, newStatus);
    await loadBookings();
  };

  const exportCSV = () => {
    const headers = ["Booking ID", "Guest", "Phone", "Email", "Room", "CheckIn", "CheckOut", "Guests", "Total Amount", "Status"];
    const rows = bookings.map((b) => [
      b.bookingNumber,
      b.guestName,
      b.phone,
      b.email,
      b.roomTitle,
      b.checkIn,
      b.checkOut,
      b.guestsCount,
      b.totalAmount,
      b.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lotus_Paradise_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSyncSheet = async () => {
    setSyncingSheet(true);
    setSyncMessage(null);
    try {
      const result = await GoogleSheetService.syncAllBookingsToSheet(bookings);
      if (result.success) {
        setSyncMessage({
          text: `Successfully synced ${result.count} bookings to your Google Sheet!`,
          isError: false,
        });
      } else {
        setSyncMessage({
          text: result.error || "Failed to sync. Please ensure Google Sheet Webhook URL is set in Settings.",
          isError: true,
        });
      }
    } catch (err: any) {
      setSyncMessage({
        text: err.message || "An error occurred during sync.",
        isError: true,
      });
    } finally {
      setSyncingSheet(false);
      setTimeout(() => setSyncMessage(null), 6000);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Reservation Pipeline Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Booking & Guest Lifecycle Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSyncSheet}
            disabled={syncingSheet || bookings.length === 0}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-emerald-500/40 transition-all"
            title="Sync all current bookings into your connected Google Sheet"
          >
            {syncingSheet ? (
              <RefreshCw className="w-4 h-4 text-[#C89D45] animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4 text-[#C89D45]" />
            )}
            <span>{syncingSheet ? "Syncing..." : "Sync with Google Sheet"}</span>
          </button>

          <button
            onClick={exportCSV}
            className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-5 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow border border-[#C89D45]/40"
          >
            <Download className="w-4 h-4 text-[#C89D45]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* SYNC NOTIFICATION BANNER */}
      {syncMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-medium animate-in fade-in ${
            syncMessage.isError
              ? "bg-red-950/80 border-red-500/50 text-red-200"
              : "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
          }`}
        >
          {syncMessage.isError ? (
            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{syncMessage.text}</span>
        </div>
      )}

      {/* FILTERS & SEARCH */}
      <div className="bg-[#2C2473] rounded-2xl p-4 border border-[#C89D45]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by guest name or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-[#C89D45]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C89D45]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED", "NO_SHOW"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-accent font-bold uppercase transition-all ${
                filterStatus === st
                  ? "bg-[#C62828] text-white border border-[#C89D45]"
                  : "bg-black/30 text-gray-300 hover:bg-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-[#2C2473] rounded-3xl p-6 border border-[#C89D45]/30 shadow-2xl overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 font-accent uppercase text-[10px]">
              <th className="pb-3">Ref ID</th>
              <th className="pb-3">Guest Info</th>
              <th className="pb-3">Room Reserved</th>
              <th className="pb-3">Check-In / Out</th>
              <th className="pb-3">Price Snapshot</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Lifecycle Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-gray-200">
            {filteredBookings.map((b) => (
              <tr key={b.id || b.bookingNumber} className="hover:bg-white/5 transition-colors">
                <td className="py-4 font-mono font-bold text-[#C89D45]">{b.bookingNumber}</td>
                <td className="py-4">
                  <div className="font-bold text-white">{b.guestName}</div>
                  <div className="text-[11px] text-gray-400">{b.phone} • {b.email}</div>
                </td>
                <td className="py-4">{b.roomTitle}</td>
                <td className="py-4">
                  {b.checkIn} → {b.checkOut}
                  <div className="text-[10px] text-gray-400">{b.guestsCount} Guests ({b.nights} Nights)</div>
                </td>
                <td className="py-4 font-bold text-white">
                  {formatPrice(b.totalAmount)}
                  <div className="text-[10px] text-[#C89D45] font-normal">{formatPrice(b.pricePerNight)} / Night</div>
                </td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-accent font-bold uppercase ${
                      b.status === "CONFIRMED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : b.status === "CHECKED_IN"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                        : b.status === "CHECKED_OUT"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        : b.status === "PENDING"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-red-500/20 text-red-300 border border-red-500/40"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1.5">
                    {b.status === "PENDING" && (
                      <button
                        onClick={() => updateStatus(b.id!, "CONFIRMED")}
                        className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 transition-colors"
                        title="Confirm Booking"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {b.status === "CONFIRMED" && (
                      <button
                        onClick={() => updateStatus(b.id!, "CHECKED_IN")}
                        className="p-1.5 rounded-lg bg-sky-600/30 text-sky-300 hover:bg-sky-600 transition-colors"
                        title="Mark Checked In"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    {b.status === "CHECKED_IN" && (
                      <button
                        onClick={() => updateStatus(b.id!, "CHECKED_OUT")}
                        className="p-1.5 rounded-lg bg-purple-600/30 text-purple-300 hover:bg-purple-600 transition-colors"
                        title="Mark Checked Out"
                      >
                        <LogOutIcon className="w-4 h-4" />
                      </button>
                    )}
                    {b.status !== "CANCELLED" && b.status !== "CHECKED_OUT" && (
                      <button
                        onClick={() => updateStatus(b.id!, "CANCELLED")}
                        className="p-1.5 rounded-lg bg-red-600/30 text-red-300 hover:bg-red-600 transition-colors"
                        title="Cancel Booking"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Generating Printable PDF Invoice for Ref: ${b.bookingNumber}`)}
                      className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 transition-colors"
                      title="Generate PDF Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
