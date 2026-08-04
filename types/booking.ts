export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

export interface Booking {
  id?: string;
  bookingNumber: string;
  guestName: string;
  phone: string;
  email: string;
  roomId: string;
  roomTitle: string;
  pricePerNight: number; // Historic Snapshot
  discount: number;
  tax: number;
  totalAmount: number;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guestsCount: number;
  specialRequests?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface RoomAvailability {
  id: string; // {roomId}_{YYYY-MM-DD}
  roomId: string;
  date: string; // YYYY-MM-DD
  status: "AVAILABLE" | "BOOKED" | "BLOCKED" | "MAINTENANCE";
  bookingId?: string;
}
