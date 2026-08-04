import type { Booking, BookingStatus } from "@/types/booking";
import { AvailabilityService } from "@/services/availability.service";
import { NotificationService } from "@/services/notification.service";

let inMemoryBookings: Booking[] = [
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
];

export const BookingService = {
  async getAllBookings(): Promise<Booking[]> {
    return [...inMemoryBookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async createBooking(data: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
    const isAvailable = await AvailabilityService.isRoomAvailable(data.roomId, data.checkIn, data.checkOut);
    if (!isAvailable) {
      throw new Error("Selected room is not available for these dates.");
    }

    const newBooking: Booking = {
      ...data,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    inMemoryBookings.push(newBooking);

    // Mark room availability dates
    await AvailabilityService.markRoomBooked(data.roomId, data.checkIn, data.checkOut, newBooking.bookingNumber);

    // Trigger Admin Notification
    await NotificationService.createNotification({
      title: `New Reservation Request from ${newBooking.guestName} (${newBooking.bookingNumber})`,
      type: "BOOKING",
      read: false,
      detailsUrl: "/admin/bookings",
    });

    return newBooking;
  },

  async updateBookingStatus(id: string, newStatus: BookingStatus): Promise<Booking> {
    const target = inMemoryBookings.find((b) => b.id === id);
    if (!target) throw new Error("Booking not found");

    target.status = newStatus;

    if (newStatus === "CANCELLED") {
      await AvailabilityService.releaseRoomDates(target.roomId, target.checkIn, target.checkOut);
    }

    return target;
  },
};
