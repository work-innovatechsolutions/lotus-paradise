import { ROOMS } from "@/lib/data";
import type { Room } from "@/types/room";

let inMemoryRooms: Room[] = ROOMS.map((r) => ({
  id: r.id,
  title: r.title,
  slug: r.slug,
  type: r.type,
  pricePerNight: r.pricePerNight,
  capacity: r.capacity,
  bedType: r.bedType,
  view: r.view,
  size: r.size,
  location: r.location,
  description: r.description,
  amenities: r.amenities,
  images: r.images.map((imgUrl, i) => ({
    url: imgUrl,
    alt: `${r.title} photo ${i + 1}`,
    order: i + 1,
  })),
  featured: r.featured,
  available: true,
}));

export const RoomService = {
  async getAllRooms(): Promise<Room[]> {
    return [...inMemoryRooms];
  },

  async getFeaturedRooms(): Promise<Room[]> {
    return inMemoryRooms.filter((r) => r.featured && r.available);
  },

  async getRoomBySlug(slug: string): Promise<Room | null> {
    return inMemoryRooms.find((r) => r.slug === slug) || null;
  },

  async getRoomById(id: string): Promise<Room | null> {
    return inMemoryRooms.find((r) => r.id === id) || null;
  },

  async createRoom(room: Omit<Room, "id">): Promise<Room> {
    const created: Room = {
      ...room,
      id: `room-${Date.now()}`,
    };
    inMemoryRooms.push(created);
    return created;
  },

  async updateRoom(id: string, updated: Partial<Room>): Promise<Room> {
    inMemoryRooms = inMemoryRooms.map((r) => (r.id === id ? { ...r, ...updated } : r));
    const target = inMemoryRooms.find((r) => r.id === id);
    if (!target) throw new Error("Room not found");
    return target;
  },

  async deleteRoom(id: string): Promise<void> {
    inMemoryRooms = inMemoryRooms.filter((r) => r.id !== id);
  },
};
