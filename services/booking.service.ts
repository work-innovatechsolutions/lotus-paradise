import type { Booking, BookingStatus } from "@/types/booking";
import { AvailabilityService } from "@/services/availability.service";
import { NotificationService } from "@/services/notification.service";
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

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    bookingNumber: "LPH-849201",
    guestName: "Anirban Roy",
    email: "anirban.roy@example.com",
    phone: "+91 98300 12345",
    roomId: "room-1",
    roomTitle: "Kanchenjunga Grand Deluxe Suite",
    pricePerNight: 4800,
    discount: 0,
    tax: 0,
    totalAmount: 14400,
    checkIn: "2026-09-15",
    checkOut: "2026-09-18",
    nights: 3,
    guestsCount: 2,
    specialRequests: "High floor balcony view, vegetarian breakfast",
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "booking-2",
    bookingNumber: "LPH-710294",
    guestName: "Dr. Richard Miller",
    email: "richard@example.com",
    phone: "+44 7911 123456",
    roomId: "room-2",
    roomTitle: "Heritage Family Duplex Suite",
    pricePerNight: 6500,
    discount: 0,
    tax: 0,
    totalAmount: 19500,
    checkIn: "2026-09-20",
    checkOut: "2026-09-23",
    nights: 3,
    guestsCount: 4,
    specialRequests: "Birding guide needed for morning walks",
    status: "PENDING",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "booking-3",
    bookingNumber: "LPH-639102",
    guestName: "Swati Sengupta",
    email: "swati.s@example.com",
    phone: "+91 94330 98765",
    roomId: "room-3",
    roomTitle: "Colonial Couple Retreat",
    pricePerNight: 3900,
    discount: 0,
    tax: 0,
    totalAmount: 7800,
    checkIn: "2026-09-25",
    checkOut: "2026-09-27",
    nights: 2,
    guestsCount: 2,
    specialRequests: "Anniversary setup with candlelit dinner",
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

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

function updateCache(items: Booking[]) {
  if (typeof window === "undefined") return;
  try {
    IdbStorage.safeLocalSet(BOOKINGS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("lp_bookings_updated"));
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
    updateCache(updated);

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

    return newBooking;
  },

  async updateBookingStatus(id: string, newStatus: BookingStatus): Promise<Booking> {
    const cached = getCachedBookings();
    const target = cached.find((b) => b.id === id);
    if (!target) throw new Error("Booking not found");

    target.status = newStatus;
    const nextList = cached.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    updateCache(nextList);

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
    updateCache(filtered);

    (async () => {
      try {
        await deleteDoc(doc(db, "bookings", id));
      } catch (err) {
        console.warn("Firestore deleteBooking sync:", err);
      }
    })();
  },
};
