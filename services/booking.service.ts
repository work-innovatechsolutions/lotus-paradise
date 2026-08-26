import type { Booking, BookingStatus } from "@/types/booking";
import { AvailabilityService } from "@/services/availability.service";
import { NotificationService } from "@/services/notification.service";

const BOOKINGS_STORAGE_KEY = "lp_bookings_v2";

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "booking-user-recent",
    bookingNumber: "LPH-681940",
    guestName: "ewrwerwr",
    email: "werwerw@GMAIL.COM",
    phone: "9933876411",
    roomId: "room-1",
    roomTitle: "Kanchenjunga Grand Deluxe Suite",
    pricePerNight: 4800,
    discount: 0,
    tax: 0,
    totalAmount: 16400,
    checkIn: "2026-08-15",
    checkOut: "2026-08-18",
    nights: 3,
    guestsCount: 3,
    specialRequests: "",
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  },
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
    checkIn: "2026-08-15",
    checkOut: "2026-08-18",
    nights: 3,
    guestsCount: 2,
    specialRequests: "High floor balcony view",
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
    checkIn: "2026-08-20",
    checkOut: "2026-08-23",
    nights: 3,
    guestsCount: 4,
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
    checkIn: "2026-08-25",
    checkOut: "2026-08-27",
    nights: 2,
    guestsCount: 2,
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

function getStoredBookings(): Booking[] {
  if (typeof window === "undefined") return DEFAULT_BOOKINGS;
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(DEFAULT_BOOKINGS));
      return DEFAULT_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_BOOKINGS;
  } catch {
    return DEFAULT_BOOKINGS;
  }
}

function saveBookings(bookings: Booking[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new Event("lp_bookings_updated"));
  } catch (err) {
    console.error("Error saving bookings to localStorage:", err);
  }
}

export const BookingService = {
  async getAllBookings(): Promise<Booking[]> {
    const bookings = getStoredBookings();
    return [...bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getBookingByNumber(bookingNumber: string): Promise<Booking | null> {
    const bookings = getStoredBookings();
    return bookings.find((b) => b.bookingNumber.toUpperCase() === bookingNumber.toUpperCase()) || null;
  },

  async createBooking(data: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
    const newBooking: Booking = {
      ...data,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const currentBookings = getStoredBookings();
    const updated = [newBooking, ...currentBookings];
    saveBookings(updated);

    // Mark room availability dates
    try {
      await AvailabilityService.markRoomBooked(data.roomId, data.checkIn, data.checkOut, newBooking.bookingNumber);
    } catch {
      // Non-blocking availability logging
    }

    // Trigger Admin Notification
    try {
      await NotificationService.createNotification({
        title: `New Reservation from ${newBooking.guestName} (${newBooking.bookingNumber})`,
        type: "BOOKING",
        read: false,
        detailsUrl: "/admin/bookings",
      });
    } catch {
      // Non-blocking notification
    }

    return newBooking;
  },

  async updateBookingStatus(id: string, newStatus: BookingStatus): Promise<Booking> {
    const currentBookings = getStoredBookings();
    const target = currentBookings.find((b) => b.id === id);
    if (!target) throw new Error("Booking not found");

    target.status = newStatus;
    saveBookings(currentBookings);

    if (newStatus === "CANCELLED") {
      try {
        await AvailabilityService.releaseRoomDates(target.roomId, target.checkIn, target.checkOut);
      } catch {
        // Non-blocking release
      }
    }

    return target;
  },

  async deleteBooking(id: string): Promise<void> {
    const currentBookings = getStoredBookings();
    const filtered = currentBookings.filter((b) => b.id !== id);
    saveBookings(filtered);
  },
};
