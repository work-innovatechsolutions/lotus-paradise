import type { Booking } from "@/types/booking";
import { SettingsService } from "./settings.service";

export interface GoogleSheetRow {
  bookingNumber: string;
  guestName: string;
  phone: string;
  email: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number | string;
  guestsCount: number | string;
  totalAmount: number | string;
  status: string;
  specialRequests: string;
  createdAt: string;
}

export const GoogleSheetService = {
  /**
   * Retrieves the configured Webhook URL from Firestore settings,
   * falling back to process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL or localStorage.
   */
  async getWebhookUrl(): Promise<string | null> {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("lp_google_sheet_url");
        if (local && local.startsWith("https://script.google.com")) {
          return local;
        }
      } catch {}
    }

    try {
      const general = await SettingsService.getGeneralSettings();
      if ((general as any).googleSheetWebhookUrl) {
        return (general as any).googleSheetWebhookUrl;
      }
    } catch {}

    return process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL || null;
  },

  /**
   * Formats a booking into clean spreadsheet payload
   */
  formatPayload(booking: Booking): GoogleSheetRow {
    return {
      bookingNumber: booking.bookingNumber || booking.id || "N/A",
      guestName: booking.guestName || "Guest",
      phone: booking.phone || "N/A",
      email: booking.email || "N/A",
      roomTitle: booking.roomTitle || "Standard Suite",
      checkIn: booking.checkIn || "",
      checkOut: booking.checkOut || "",
      nights: booking.nights || 1,
      guestsCount: booking.guestsCount || 1,
      totalAmount: booking.totalAmount || 0,
      status: booking.status || "CONFIRMED",
      specialRequests: booking.specialRequests || "None",
      createdAt: booking.createdAt ? new Date(booking.createdAt).toLocaleString("en-IN") : new Date().toLocaleString("en-IN"),
    };
  },

  /**
   * Syncs a single booking row to the Google Sheet via server API or direct
   */
  async syncBookingToSheet(
    booking: Booking,
    customUrl?: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    const payload = this.formatPayload(booking);

    // 1. Try server-side API proxy first (bypasses browser CORS completely)
    try {
      const serverRes = await fetch("/api/sync-google-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_booking",
          booking: payload,
          webhookUrl: customUrl || undefined,
        }),
      });

      const json = await serverRes.json();
      if (serverRes.ok && json.success) {
        return { success: true, message: "Booking synced to Google Sheet" };
      }
      if (serverRes.status === 400 && json.error?.includes("not configured")) {
        return { success: false, error: json.error };
      }
    } catch {
      // fallback to direct fetch if server API is unreachable
    }

    // 2. Direct fallback
    const url = customUrl || (await this.getWebhookUrl());
    if (!url) {
      return { success: false, error: "No Google Sheet Webhook URL configured. Please set in Admin Settings." };
    }

    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "add_booking",
          booking: payload,
        }),
      });

      return { success: true, message: "Booking synced to Google Sheet" };
    } catch (err: any) {
      console.warn("Google Sheet sync error:", err);
      return { success: false, error: err.message || "Failed to sync" };
    }
  },

  /**
   * Syncs multiple bookings in batch via server API
   */
  async syncAllBookingsToSheet(
    bookings: Booking[],
    customUrl?: string
  ): Promise<{ success: boolean; count: number; error?: string }> {
    const rows = bookings.map((b) => this.formatPayload(b));

    // 1. Try server-side API proxy first
    try {
      const serverRes = await fetch("/api/sync-google-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "batch_sync",
          bookings: rows,
          webhookUrl: customUrl || undefined,
        }),
      });

      const json = await serverRes.json();
      if (serverRes.ok && json.success) {
        return { success: true, count: rows.length };
      }
      if (serverRes.status === 400 && json.error?.includes("not configured")) {
        return { success: false, count: 0, error: json.error };
      }
    } catch {
      // fallback to direct
    }

    const url = customUrl || (await this.getWebhookUrl());
    if (!url) {
      return { success: false, count: 0, error: "No Google Sheet Webhook URL configured. Please set in Admin Settings." };
    }

    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          action: "batch_sync",
          bookings: rows,
        }),
      });

      return { success: true, count: rows.length };
    } catch (err: any) {
      console.warn("Google Sheet batch sync error:", err);
      return { success: false, count: 0, error: err.message || "Failed to sync" };
    }
  },

  /**
   * Tests the connection by pinging the webhook
   */
  async testConnection(url: string): Promise<{ success: boolean; message: string }> {
    if (!url || !url.startsWith("https://script.google.com")) {
      return { success: false, message: "Please provide a valid Google Apps Script Web App URL." };
    }

    try {
      const testBooking: Booking = {
        id: "test-ping",
        bookingNumber: "TEST-PING",
        guestName: "System Test",
        email: "test@lotusparadise.com",
        phone: "+91 99999 99999",
        roomId: "test-room",
        roomTitle: "System Test Verification",
        pricePerNight: 0,
        discount: 0,
        tax: 0,
        totalAmount: 0,
        checkIn: new Date().toISOString().slice(0, 10),
        checkOut: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        nights: 1,
        guestsCount: 1,
        status: "CONFIRMED",
        specialRequests: "Connection verification ping",
        createdAt: new Date().toISOString(),
      };

      await this.syncBookingToSheet(testBooking, url);
      return {
        success: true,
        message: "Successfully connected! A test row has been appended to your Google Sheet.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Connection failed: ${err.message || "Unknown error"}`,
      };
    }
  },
};
