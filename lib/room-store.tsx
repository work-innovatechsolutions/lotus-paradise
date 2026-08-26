"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ROOMS, type RoomData } from "@/lib/data";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface StoreProperty {
  id: string;
  name: string;
  location: string;
  mapLink?: string;
  description: string;
  coverImage: string;
  images?: string[];
}

export interface StoreRoom {
  id: string;
  propertyId: string;   // belongs to which property
  title: string;
  slug: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  quantity: number;     // number of physical rooms of this type
  bedType: string;
  view: string;
  size: string;
  location: string;     // kept for backward compat on public page
  description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  available: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

interface RoomStoreCtx {
  // Properties
  properties: StoreProperty[];
  addProperty: (p: Omit<StoreProperty, "id">) => StoreProperty;
  updateProperty: (id: string, data: Partial<StoreProperty>) => void;
  deleteProperty: (id: string) => void;

  // Rooms
  rooms: StoreRoom[];
  addRoom: (room: Omit<StoreRoom, "id" | "slug">) => void;
  updateRoom: (id: string, data: Partial<StoreRoom>) => void;
  deleteRoom: (id: string) => void;
  toggleAvailability: (id: string) => void;
}

const RoomStoreContext = createContext<RoomStoreCtx | null>(null);

const PROP_KEY = "lp_properties_v1";
const ROOM_KEY = "lp_room_store_v3";

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_PROPERTIES: StoreProperty[] = [
  {
    id: "prop-1",
    name: "Lotus Paradise — Latpanchar",
    location: "Latpanchar, North Bengal",
    mapLink: "https://maps.google.com/?q=Latpanchar+Darjeeling+West+Bengal",
    description:
      "Our flagship mountain homestay nestled at 4,500 ft inside Mahananda Wildlife Sanctuary, offering panoramic Kanchenjunga views.",
    coverImage: "/images/hero/bengal-latpanchar.jpg.jpeg",
  },
  {
    id: "prop-2",
    name: "Lotus Paradise — Sittong",
    location: "Sittong, Darjeeling",
    mapLink: "https://maps.google.com/?q=Sittong+Orange+Valley+Darjeeling",
    description:
      "A serene colonial retreat amid the famous orange orchards of Sittong Valley, Darjeeling district.",
    coverImage: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
  },
];

function seedRooms(properties: StoreProperty[]): StoreRoom[] {
  const propMap: Record<string, string> = {};
  properties.forEach((p) => {
    propMap[p.location] = p.id;
  });

  return ROOMS.map((r: RoomData) => ({
    id: r.id,
    propertyId: propMap[r.location] ?? properties[0]?.id ?? "prop-1",
    title: r.title,
    slug: r.slug,
    type: r.type,
    pricePerNight: r.pricePerNight,
    capacity: r.capacity,
    quantity: 1,
    bedType: r.bedType,
    view: r.view,
    size: r.size,
    location: r.location,
    description: r.description,
    amenities: r.amenities,
    images: r.images,
    featured: r.featured,
    available: true,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

import { IdbStorage } from "@/lib/idb-storage";

export function RoomStoreProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<StoreProperty[]>([]);
  const [rooms, setRooms] = useState<StoreRoom[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // 1. Try loading from IndexedDB first (highest capacity)
        let loadedProps = await IdbStorage.get<StoreProperty[]>(PROP_KEY);
        let loadedRooms = await IdbStorage.get<StoreRoom[]>(ROOM_KEY);

        // 2. Fallback to localStorage if IndexedDB is empty
        if (!loadedProps || loadedProps.length === 0) {
          const rawProps = IdbStorage.safeLocalGet(PROP_KEY);
          if (rawProps) {
            try { loadedProps = JSON.parse(rawProps); } catch {}
          }
        }
        if (!loadedRooms || loadedRooms.length === 0) {
          const rawRooms = IdbStorage.safeLocalGet(ROOM_KEY);
          if (rawRooms) {
            try { loadedRooms = JSON.parse(rawRooms); } catch {}
          }
        }

        const props = (loadedProps && loadedProps.length > 0) ? loadedProps : DEFAULT_PROPERTIES;
        const initialRooms = (loadedRooms && loadedRooms.length > 0) ? loadedRooms : seedRooms(props);

        if (isMounted) {
          setProperties(props);
          setRooms(initialRooms);
          setHydrated(true);
        }
      } catch (err) {
        console.error("RoomStore loading error:", err);
        if (isMounted) {
          setProperties(DEFAULT_PROPERTIES);
          setRooms(seedRooms(DEFAULT_PROPERTIES));
          setHydrated(true);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save properties safely to IndexedDB and localStorage
  useEffect(() => {
    if (hydrated) {
      IdbStorage.set(PROP_KEY, properties);
      IdbStorage.safeLocalSet(PROP_KEY, JSON.stringify(properties));
    }
  }, [properties, hydrated]);

  // Save rooms safely to IndexedDB and localStorage
  useEffect(() => {
    if (hydrated) {
      IdbStorage.set(ROOM_KEY, rooms);
      IdbStorage.safeLocalSet(ROOM_KEY, JSON.stringify(rooms));
    }
  }, [rooms, hydrated]);

  // ── Property actions ───────────────────────────────────────────────────────

  const addProperty = useCallback((p: Omit<StoreProperty, "id">): StoreProperty => {
    const created: StoreProperty = { ...p, id: `prop-${Date.now()}` };
    setProperties((prev) => [...prev, created]);
    return created;
  }, []);

  const updateProperty = useCallback((id: string, data: Partial<StoreProperty>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  }, []);

  const deleteProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setRooms((prev) => prev.filter((r) => r.propertyId !== id));
  }, []);

  // ── Room actions ───────────────────────────────────────────────────────────

  const addRoom = useCallback((room: Omit<StoreRoom, "id" | "slug">) => {
    const id   = `room-${Date.now()}`;
    const slug = room.title.toLowerCase().replace(/\s+/g, "-");
    setRooms((prev) => [...prev, { ...room, id, slug }]);
  }, []);

  const updateRoom = useCallback((id: string, data: Partial<StoreRoom>) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              ...data,
              slug: data.title
                ? data.title.toLowerCase().replace(/\s+/g, "-")
                : r.slug,
            }
          : r
      )
    );
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleAvailability = useCallback((id: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, available: !r.available } : r))
    );
  }, []);

  if (!hydrated) return null;

  return (
    <RoomStoreContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        toggleAvailability,
      }}
    >
      {children}
    </RoomStoreContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useRoomStore(): RoomStoreCtx {
  const ctx = useContext(RoomStoreContext);
  if (!ctx) throw new Error("useRoomStore must be used inside <RoomStoreProvider>");
  return ctx;
}
