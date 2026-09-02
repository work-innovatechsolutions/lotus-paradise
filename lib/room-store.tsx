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

// Images / data updated in Firebase are guaranteed visible within this window.
const MAX_CACHE_AGE_MS = 5 * 60 * 1000; // 5 minutes

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

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export function RoomStoreProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<StoreProperty[]>([]);
  const [rooms, setRooms] = useState<StoreRoom[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // ── Step 1: Read cached data from IDB / localStorage ──────────────
        const propMeta = await IdbStorage.getWithMeta<StoreProperty[]>(PROP_KEY);
        const roomMeta = await IdbStorage.getWithMeta<StoreRoom[]>(ROOM_KEY);

        let cachedProps: StoreProperty[] | null =
          propMeta && Array.isArray(propMeta.data) && propMeta.data.length > 0
            ? propMeta.data
            : null;
        let cachedRooms: StoreRoom[] | null =
          roomMeta && Array.isArray(roomMeta.data) && roomMeta.data.length > 0
            ? roomMeta.data
            : null;

        // Legacy localStorage fallback (for users who visited before this fix)
        if (!cachedProps) {
          const rawProps = IdbStorage.safeLocalGet(PROP_KEY);
          if (rawProps) {
            try { cachedProps = JSON.parse(rawProps); } catch {}
          }
        }
        if (!cachedRooms) {
          const rawRooms = IdbStorage.safeLocalGet(ROOM_KEY);
          if (rawRooms) {
            try { cachedRooms = JSON.parse(rawRooms); } catch {}
          }
        }

        // Check whether the cached data is stale
        const propAge = propMeta ? Date.now() - propMeta.syncedAt : Infinity;
        const roomAge = roomMeta ? Date.now() - roomMeta.syncedAt : Infinity;
        const propStale = propAge > MAX_CACHE_AGE_MS;
        const roomStale = roomAge > MAX_CACHE_AGE_MS;

        // ── Step 2: Populate state immediately with whatever we have ──────
        const initialProps = cachedProps && cachedProps.length > 0
          ? cachedProps
          : DEFAULT_PROPERTIES;
        const initialRooms = cachedRooms && cachedRooms.length > 0
          ? cachedRooms
          : seedRooms(initialProps);

        if (isMounted) {
          setProperties(initialProps);
          setRooms(initialRooms);
          setHydrated(true);
        }

        // ── Step 3: Fetch from Firestore ──────────────────────────────────
        // If cache is stale (or empty), we MUST refresh from Firestore.
        // If cache is fresh, we still do a background refresh so the *next*
        // page load picks up any changes made by the admin.
        const shouldFetchProps = propStale || !cachedProps;
        const shouldFetchRooms = roomStale || !cachedRooms;

        if (shouldFetchProps || shouldFetchRooms) {
          try {
            const [propsSnap, roomsSnap] = await Promise.all([
              getDocs(collection(db, "properties")),
              getDocs(collection(db, "rooms")),
            ]);

            if (propsSnap && !propsSnap.empty && isMounted) {
              const firestoreProps = propsSnap.docs.map(
                (d) => ({ id: d.id, ...d.data() } as StoreProperty)
              );
              setProperties(firestoreProps);
              await IdbStorage.setWithMeta(PROP_KEY, firestoreProps);
              IdbStorage.safeLocalSet(PROP_KEY, JSON.stringify(firestoreProps));
            } else if (propsSnap && propsSnap.empty) {
              for (const p of DEFAULT_PROPERTIES) {
                await setDoc(doc(db, "properties", p.id), p);
              }
            }

            if (roomsSnap && !roomsSnap.empty && isMounted) {
              const firestoreRooms = roomsSnap.docs.map(
                (d) => ({ id: d.id, ...d.data() } as StoreRoom)
              );
              setRooms(firestoreRooms);
              await IdbStorage.setWithMeta(ROOM_KEY, firestoreRooms);
              IdbStorage.safeLocalSet(ROOM_KEY, JSON.stringify(firestoreRooms));
            } else if (roomsSnap && roomsSnap.empty) {
              const defaultRooms = seedRooms(DEFAULT_PROPERTIES);
              for (const r of defaultRooms) {
                await setDoc(doc(db, "rooms", r.id), r);
              }
            }
          } catch (fErr) {
            console.warn("Firestore sync warning (using cached data):", fErr);
          }
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

  // Persist to IDB and localStorage whenever state changes (post-hydration)
  useEffect(() => {
    if (hydrated) {
      IdbStorage.setWithMeta(PROP_KEY, properties);
      IdbStorage.safeLocalSet(PROP_KEY, JSON.stringify(properties));
    }
  }, [properties, hydrated]);

  useEffect(() => {
    if (hydrated) {
      IdbStorage.setWithMeta(ROOM_KEY, rooms);
      IdbStorage.safeLocalSet(ROOM_KEY, JSON.stringify(rooms));
    }
  }, [rooms, hydrated]);

  // ── Property actions ─────────────────────────────────────────────────────

  const addProperty = useCallback((p: Omit<StoreProperty, "id">): StoreProperty => {
    const created: StoreProperty = { ...p, id: `prop-${Date.now()}` };
    setProperties((prev) => [...prev, created]);
    setDoc(doc(db, "properties", created.id), created).catch(console.error);
    return created;
  }, []);

  const updateProperty = useCallback((id: string, data: Partial<StoreProperty>) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...data };
          setDoc(doc(db, "properties", id), updated, { merge: true }).catch(console.error);
          return updated;
        }
        return p;
      })
    );
  }, []);

  const deleteProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setRooms((prev) => prev.filter((r) => r.propertyId !== id));
    deleteDoc(doc(db, "properties", id)).catch(console.error);
  }, []);

  // ── Room actions ─────────────────────────────────────────────────────────

  const addRoom = useCallback((room: Omit<StoreRoom, "id" | "slug">) => {
    const id = `room-${Date.now()}`;
    const slug = room.title.toLowerCase().replace(/\s+/g, "-");
    const created: StoreRoom = { ...room, id, slug };
    setRooms((prev) => [...prev, created]);
    setDoc(doc(db, "rooms", id), created).catch(console.error);
  }, []);

  const updateRoom = useCallback((id: string, data: Partial<StoreRoom>) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = {
            ...r,
            ...data,
            slug: data.title
              ? data.title.toLowerCase().replace(/\s+/g, "-")
              : r.slug,
          };
          setDoc(doc(db, "rooms", id), updated, { merge: true }).catch(console.error);
          return updated;
        }
        return r;
      })
    );
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    deleteDoc(doc(db, "rooms", id)).catch(console.error);
  }, []);

  const toggleAvailability = useCallback((id: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, available: !r.available };
          setDoc(doc(db, "rooms", id), { available: updated.available }, { merge: true }).catch(
            console.error
          );
          return updated;
        }
        return r;
      })
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
