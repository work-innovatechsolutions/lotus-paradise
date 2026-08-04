import type { RoomAvailability } from "@/types/booking";

// In-memory availability store fallback
const availabilityMap = new Map<string, RoomAvailability>();

export const AvailabilityService = {
  getDatesInRange(checkIn: string, checkOut: string): string[] {
    const dates: string[] = [];
    const curr = new Date(checkIn);
    const end = new Date(checkOut);
    while (curr < end) {
      dates.push(curr.toISOString().slice(0, 10));
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  },

  async isRoomAvailable(roomId: string, checkIn: string, checkOut: string): Promise<boolean> {
    const dates = this.getDatesInRange(checkIn, checkOut);
    for (const d of dates) {
      const key = `${roomId}_${d}`;
      const record = availabilityMap.get(key);
      if (record && (record.status === "BOOKED" || record.status === "BLOCKED" || record.status === "MAINTENANCE")) {
        return false;
      }
    }
    return true;
  },

  async markRoomBooked(roomId: string, checkIn: string, checkOut: string, bookingId: string): Promise<void> {
    const dates = this.getDatesInRange(checkIn, checkOut);
    for (const d of dates) {
      const key = `${roomId}_${d}`;
      availabilityMap.set(key, {
        id: key,
        roomId,
        date: d,
        status: "BOOKED",
        bookingId,
      });
    }
  },

  async releaseRoomDates(roomId: string, checkIn: string, checkOut: string): Promise<void> {
    const dates = this.getDatesInRange(checkIn, checkOut);
    for (const d of dates) {
      const key = `${roomId}_${d}`;
      availabilityMap.delete(key);
    }
  },
};
