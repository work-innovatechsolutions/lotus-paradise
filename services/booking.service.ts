import type { Booking, BookingStatus } from "@/types/booking";
import { AvailabilityService } from "@/services/availability.service";
import { NotificationService } from "@/services/notification.service";
import { GoogleSheetService } from "@/services/google-sheet.service";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { IdbStorage } from "@/lib/idb-storage";

const BOOKINGS_STORAGE_KEY = "lp_bookings_v2";

// Only real bookings are stored
const DEFAULT_BOOKINGS: Booking[] = [];

function getCachedBookings(): Booking[] {
  if (typeof window === "undefined") return DEFAULT_BOOKINGS;
  try {
    const raw = IdbStorage.safeLocalGet(BOOKINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_BOOKINGS;
}

function updateCache(items: Booking[], notify = false) {
  if (typeof window === "undefined") return;
  try {
    IdbStorage.safeLocalSet(BOOKINGS_STORAGE_KEY, JSON.stringify(items));
    if (notify) {
      window.dispatchEvent(new Event("lp_bookings_updated"));
    }
  } catch {}
}

export const BookingService = {
  async getAllBookings(): Promise<Booking[]> {
    const cached = getCachedBookings();

    try {
      const colRef = collection(db, "bookings");
      const fetchPromise = getDocs(query(colRef, orderBy("createdAt", "desc")));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 2500)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;
      if (snapshot && !snapshot.empty) {
        const firestoreData = snapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Booking[];

        updateCache(firestoreData);
        return firestoreData;
      }
    } catch (err) {
      console.warn("Firestore bookings fetch error:", err);
    }

    return [...cached].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getBookingByNumber(bookingNumber: string): Promise<Booking | null> {
    const bookings = await this.getAllBookings();
    return (
      bookings.find((b) => b.bookingNumber.toUpperCase() === bookingNumber.toUpperCase()) || null
    );
  },

  async createBooking(data: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
    const newId = `booking-${Date.now()}`;
    const newBooking: Booking = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    const cached = getCachedBookings();
    const updated = [newBooking, ...cached];
    updateCache(updated, true);

    (async () => {
      try {
        await setDoc(doc(db, "bookings", newId), newBooking);
      } catch (err) {
        console.warn("Firestore createBooking sync:", err);
      }
    })();

    // Mark room availability dates
    try {
      await AvailabilityService.markRoomBooked(data.roomId, data.checkIn, data.checkOut, newBooking.bookingNumber);
    } catch {}

    // Trigger Admin Notification
    try {
      await NotificationService.createNotification({
        title: `New Reservation from ${newBooking.guestName} (${newBooking.bookingNumber})`,
        type: "BOOKING",
        read: false,
        detailsUrl: "/admin/bookings",
      });
    } catch {}

    // Trigger Google Sheet live sync in background
    (async () => {
      try {
        await GoogleSheetService.syncBookingToSheet(newBooking);
      } catch (err) {
        console.warn("Google Sheet sync warning:", err);
      }
    })();

    // Trigger automated Gmail SMTP booking email to both guest and admin
    (async () => {
      try {
        if (typeof window !== "undefined") {
          fetch("/api/send-booking-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking: newBooking }),
          }).catch((err) => console.warn("Booking email dispatch warning:", err));
        }
      } catch (err) {
        console.warn("Booking email trigger warning:", err);
      }
    })();

    return newBooking;
  },

  async updateBookingStatus(id: string, newStatus: BookingStatus): Promise<Booking> {
    const cached = getCachedBookings();
    const target = cached.find((b) => b.id === id);
    if (!target) throw new Error("Booking not found");

    target.status = newStatus;
    const nextList = cached.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    updateCache(nextList, true);

    (async () => {
      try {
        await setDoc(doc(db, "bookings", id), { status: newStatus }, { merge: true });
      } catch (err) {
        console.warn("Firestore updateBookingStatus sync:", err);
      }
    })();

    if (newStatus === "CANCELLED") {
      try {
        await AvailabilityService.releaseRoomDates(target.roomId, target.checkIn, target.checkOut);
      } catch {}
    }

    return target;
  },

  async deleteBooking(id: string): Promise<void> {
    const cached = getCachedBookings();
    const filtered = cached.filter((b) => b.id !== id);
    updateCache(filtered, true);

    (async () => {
      try {
        await deleteDoc(doc(db, "bookings", id));
      } catch (err) {
        console.warn("Firestore deleteBooking sync:", err);
      }
    })();
  },
};
