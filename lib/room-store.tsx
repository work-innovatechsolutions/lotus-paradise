"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { IdbStorage } from "@/lib/idb-storage";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

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
  floor?: "Ground Floor" | "First Floor" | string;
  pricePerNight: number;        // Base tariff (Standard per pax)
  standardPricePerPax?: number; // Standard package Fooding & Lodging per pax/day
  premiumPricePerPax?: number;  // Premium package Fooding & Lodging per pax/day
  minCapacity?: number;         // e.g. 2 or 6
  capacity: number;             // max accommodation e.g. 4 or 8
  quantity: number;             // number of physical rooms of this type
  bedType: string;
  view: string;
  size: string;
  location: string;             // kept for backward compat on public page
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

const PROP_KEY = "lp_properties_v2";
const ROOM_KEY = "lp_room_store_v5";

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA (EXACT CURRENT PROPERTIES & ROOMS)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_PROPERTIES: StoreProperty[] = [
  {
    id: "prop-1",
    name: "Lotus Paradise — Latpanchar",
    location: "Latpanchar, North Bengal",
    mapLink: "https://maps.google.com/?q=Latpanchar+Darjeeling+West+Bengal",
    description:
      "Our flagship mountain homestay nestled at 4,500 ft inside Mahananda Wildlife Sanctuary, offering panoramic Kanchenjunga views.",
    coverImage: "/images/properties/hotel_night.jpeg",
    images: [
      "/images/properties/hotel_night.jpeg",
      "/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg",
      "/images/hero/b.jpg.jpg.jpeg",
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.34 PM.jpeg",
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.36 PM.jpeg",
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.36 PM (1).jpeg",
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.37 PM.jpeg",
      "/images/properties/ChatGPT Image Aug 4, 2026, 11_21_47 PM.png",
      "/images/properties/ChatGPT Image Aug 4, 2026, 11_59_03 PM.png",
    ],
  },
  {
    id: "prop-2",
    name: "Chu & Isultim",
    location: "North Bengal",
    mapLink: "https://maps.google.com/?q=Latpanchar+Sittong+North+Bengal",
    description:
      "A serene Himalayan haven offering colonial charm, breathtaking Kanchenjunga panoramas, and authentic mountain hospitality.",
    coverImage: "/images/properties/WhatsApp Image 2026-08-04 at 11.06.37 PM (1).jpeg",
    images: [
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.37 PM (1).jpeg",
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.34 PM.jpeg",
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.36 PM.jpeg",
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.36 PM (1).jpeg",
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.37 PM.jpeg",
      "/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg",
      "/images/hero/b.jpg.jpg.jpeg",
      "/images/hero/13.jpg.jpeg",
      "/images/properties/ChatGPT Image Aug 4, 2026, 11_21_47 PM.png",
      "/images/properties/ChatGPT Image Aug 4, 2026, 11_59_03 PM.png",
      "/images/hero/himalayan-horizon-view.jpeg",
      "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
      "/images/rooms/room1.jpg",
      "/images/rooms/room2.jpg",
      "/images/rooms/room3.jpg",
      "/images/rooms/room4.jpeg",
      "/images/properties/hotel_night.jpeg",
      "/images/hero/mahananda-wildlife-sanctuary-siliguri2-attr-hero.jpe",
      "/images/hero/bengal-latpanchar.jpg.jpeg",
    ],
  },
];

const DEFAULT_ROOMS: StoreRoom[] = [
  // ── LOTUS PARADISE — LATPANCHAR (prop-1) ───────────────────────────────────
  {
    id: "room-gf-deluxe",
    propertyId: "prop-1",
    title: "Deluxe Room (Ground Floor)",
    slug: "deluxe-room-ground-floor",
    type: "Deluxe Room",
    floor: "Ground Floor",
    pricePerNight: 1550,
    standardPricePerPax: 1550,
    premiumPricePerPax: 2100,
    minCapacity: 2,
    capacity: 4,
    quantity: 2,
    bedType: "King Bed + Extra Bed Option",
    view: "Tranquil Garden & Pine Forest View",
    size: "360 sq ft",
    location: "Latpanchar, North Bengal",
    description:
      "Comfortable ground floor deluxe room offering easy ground access, traditional teakwood decor, and serene garden ambiance. Complete all-inclusive Fooding & Lodging package with hot, delicious home-style Himalayan meals.",
    amenities: [
      "Fooding & Lodging Included",
      "Standard: ₹1,550/pax | Premium: ₹2,100/pax",
      "Accommodation: 2 - 4 Pax",
      "Ground Floor Easy Access",
      "All 4 Daily Meals (Breakfast, Lunch, Snacks, Dinner)",
      "Attached Bathroom & Instant Geyser",
      "Electric Kettle & Darjeeling Tea",
      "Free High-Speed WiFi",
    ],
    images: [
      "/images/rooms/room1.jpg",
      "/images/rooms/room2.jpg",
    ],
    featured: true,
    available: true,
  },
  {
    id: "room-gf-family",
    propertyId: "prop-1",
    title: "Deluxe Family Room (Ground Floor)",
    slug: "deluxe-family-room-ground-floor",
    type: "Deluxe Family Room",
    floor: "Ground Floor",
    pricePerNight: 1550,
    standardPricePerPax: 1550,
    premiumPricePerPax: 2100,
    minCapacity: 6,
    capacity: 8,
    quantity: 1,
    bedType: "2 King Beds + Daybed Seating",
    view: "Courtyard Garden & Mountain Valley View",
    size: "560 sq ft",
    location: "Latpanchar, North Bengal",
    description:
      "Spacious ground floor retreat specifically designed for family vacations and group retreats. Includes multi-bed configuration, generous family lounge, and all-inclusive Fooding & Lodging package.",
    amenities: [
      "Fooding & Lodging Included",
      "Standard: ₹1,550/pax | Premium: ₹2,100/pax",
      "Accommodation: 6 - 8 Pax",
      "Spacious Multi-Bed Layout",
      "All 4 Daily Meals Included",
      "Instant Hot Geyser",
      "Free High-Speed WiFi",
      "Electric Bed Warmer (Winter)",
    ],
    images: [
      "/images/rooms/room3.jpg",
      "/images/rooms/room4.jpeg",
    ],
    featured: true,
    available: true,
  },
  {
    id: "room-ff-deluxe",
    propertyId: "prop-1",
    title: "Deluxe Room (First Floor)",
    slug: "deluxe-room-first-floor",
    type: "Deluxe Room",
    floor: "First Floor",
    pricePerNight: 1650,
    standardPricePerPax: 1650,
    premiumPricePerPax: 2250,
    minCapacity: 2,
    capacity: 4,
    quantity: 2,
    bedType: "King Bed + Balcony Setup",
    view: "Panoramic Kanchenjunga & Sunrise Valley View",
    size: "390 sq ft",
    location: "Latpanchar, North Bengal",
    description:
      "Elevated first floor deluxe sanctuary featuring a private mountain-view balcony directly facing Mount Kanchenjunga. Complete Fooding & Lodging package with exquisite organic mountain meals.",
    amenities: [
      "Fooding & Lodging Included",
      "Standard: ₹1,650/pax | Premium: ₹2,250/pax",
      "Private Kanchenjunga Balcony",
      "Accommodation: 2 - 4 Pax",
      "First Floor Elevated Vista",
      "All 4 Daily Meals Included",
      "Instant Hot Geyser & Toiletries",
      "Electric Blanket Warming",
    ],
    images: [
      "/images/rooms/room2.jpg",
      "/images/rooms/room1.jpg",
    ],
    featured: true,
    available: true,
  },
  {
    id: "room-ff-family",
    propertyId: "prop-1",
    title: "Deluxe Family Room (First Floor)",
    slug: "deluxe-family-room-first-floor",
    type: "Deluxe Family Room",
    floor: "First Floor",
    pricePerNight: 1650,
    standardPricePerPax: 1650,
    premiumPricePerPax: 2250,
    minCapacity: 6,
    capacity: 8,
    quantity: 1,
    bedType: "2 King Beds + Balcony Sitting",
    view: "Panoramic Himalayan Mountain Range & Peak View",
    size: "620 sq ft",
    location: "Latpanchar, North Bengal",
    description:
      "The premier mountain-view family suite on the first floor. Expansive private balcony showcasing the Eastern Himalayan panorama, lavish space for 6 to 8 guests, and complete all-inclusive Fooding & Lodging.",
    amenities: [
      "Fooding & Lodging Included",
      "Standard: ₹1,650/pax | Premium: ₹2,250/pax",
      "Expansive Peak View Balcony",
      "Accommodation: 6 - 8 Pax",
      "Accommodates up to 8 Guests",
      "All 4 Daily Meals Included",
      "Dual Vanity & Hot Water Geyser",
      "Electric Heating / Bed Warmers",
    ],
    images: [
      "/images/rooms/room4.jpeg",
      "/images/rooms/room3.jpg",
    ],
    featured: true,
    available: true,
  },

  // ── CHU & ISULTIM (prop-2) ─────────────────────────────────────────────────
  {
    id: "prop2-room-gf-deluxe",
    propertyId: "prop-2",
    title: "Deluxe Room (Ground Floor)",
    slug: "chu-isultim-deluxe-room-ground-floor",
    type: "Deluxe Room",
    floor: "Ground Floor",
    pricePerNight: 1550,
    standardPricePerPax: 1550,
    premiumPricePerPax: 2100,
    minCapacity: 2,
    capacity: 4,
    quantity: 2,
    bedType: "King Bed + Extra Bed Option",
    view: "Heritage Courtyard & Forest View",
    size: "360 sq ft",
    location: "North Bengal",
    description:
      "Warm ground floor mountain suite with colonial accents and courtyard access. Complete Fooding & Lodging package with authentic regional cuisine.",
    amenities: [
      "Fooding & Lodging Included",
      "Standard: ₹1,550/pax | Premium: ₹2,100/pax",
      "Accommodation: 2 - 4 Pax",
      "Ground Floor Easy Access",
      "All 4 Daily Meals Included",
      "Instant Hot Geyser",
      "Free High-Speed WiFi",
    ],
    images: [
      "/images/rooms/room1.jpg",
      "/images/properties/WhatsApp Image 2026-08-04 at 11.06.37 PM (1).jpeg",
    ],
    featured: true,
    available: true,
  },
  {
    id: "prop2-room-ff-deluxe",
    propertyId: "prop-2",
    title: "Deluxe Room (First Floor)",
    slug: "chu-isultim-deluxe-room-first-floor",
    type: "Deluxe Room",
    floor: "First Floor",
    pricePerNight: 1650,
    standardPricePerPax: 1650,
    premiumPricePerPax: 2250,
    minCapacity: 2,
    capacity: 4,
    quantity: 2,
    bedType: "King Bed with Private Balcony",
    view: "Panoramic Mountain & Valley View",
    size: "390 sq ft",
    location: "North Bengal",
    description:
      "First floor retreat with sweeping mountain balconies and cool mountain breezes. Complete Fooding & Lodging package with gourmet local meals.",
    amenities: [
      "Fooding & Lodging Included",
      "Standard: ₹1,650/pax | Premium: ₹2,250/pax",
      "Private Mountain Balcony",
      "Accommodation: 2 - 4 Pax",
      "All 4 Daily Meals Included",
      "Instant Hot Geyser",
      "Free High-Speed WiFi",
    ],
    images: [
      "/images/rooms/room2.jpg",
      "/images/rooms/room3.jpg",
    ],
    featured: true,
    available: true,
  },
  {
    id: "prop2-room-gf-family",
    propertyId: "prop-2",
    title: "Deluxe Family Room (Ground Floor)",
    slug: "chu-isultim-deluxe-family-room-ground-floor",
    type: "Deluxe Family Room",
    floor: "Ground Floor",
    pricePerNight: 1550,
    standardPricePerPax: 1550,
    premiumPricePerPax: 2100,
    minCapacity: 6,
    capacity: 8,
    quantity: 1,
    bedType: "2 King Beds + Daybed Seating",
    view: "Heritage Courtyard Garden & Mountain Valley View",
    size: "560 sq ft",
    location: "North Bengal",
    description:
      "Spacious ground floor family suite at Chu & Isultim designed for groups and family retreats. Complete all-inclusive Fooding & Lodging package with hot, delicious regional Himalayan meals.",
    amenities: [
      "Fooding & Lodging Included",
      "Standard: ₹1,550/pax | Premium: ₹2,100/pax",
      "Accommodation: 6 - 8 Pax",
      "Spacious Multi-Bed Layout",
      "All 4 Daily Meals Included",
      "Instant Hot Geyser",
      "Free High-Speed WiFi",
      "Electric Bed Warmer (Winter)",
    ],
    images: [
      "/images/rooms/room3.jpg",
      "/images/rooms/room4.jpeg",
    ],
    featured: true,
    available: true,
  },
  {
    id: "prop2-room-ff-family",
    propertyId: "prop-2",
    title: "Deluxe Family Room (First Floor)",
    slug: "chu-isultim-deluxe-family-room-first-floor",
    type: "Deluxe Family Room",
    floor: "First Floor",
    pricePerNight: 1650,
    standardPricePerPax: 1650,
    premiumPricePerPax: 2250,
    minCapacity: 6,
    capacity: 8,
    quantity: 1,
    bedType: "2 King Beds + Balcony Sitting",
    view: "Panoramic Himalayan Mountain Range & Peak View",
    size: "620 sq ft",
    location: "North Bengal",
    description:
      "Premier first floor mountain-view family suite at Chu & Isultim. Expansive private balcony overlooking the mountain range, comfortable space for 6 to 8 guests, and complete all-inclusive Fooding & Lodging.",
    amenities: [
      "Fooding & Lodging Included",
      "Standard: ₹1,650/pax | Premium: ₹2,250/pax",
      "Expansive Peak View Balcony",
      "Accommodation: 6 - 8 Pax",
      "Accommodates up to 8 Guests",
      "All 4 Daily Meals Included",
      "Dual Vanity & Hot Water Geyser",
      "Electric Heating / Bed Warmers",
    ],
    images: [
      "/images/rooms/room4.jpeg",
      "/images/rooms/room3.jpg",
    ],
    featured: true,
    available: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function RoomStoreProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<StoreProperty[]>(DEFAULT_PROPERTIES);
  const [rooms, setRooms] = useState<StoreRoom[]>(DEFAULT_ROOMS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // ── 1. Fast initial load from IDB / LocalStorage cache ────────────────
    async function loadCached() {
      try {
        const propMeta = await IdbStorage.getWithMeta<StoreProperty[]>(PROP_KEY);
        const roomMeta = await IdbStorage.getWithMeta<StoreRoom[]>(ROOM_KEY);

        if (propMeta?.data && Array.isArray(propMeta.data) && propMeta.data.length > 0) {
          if (isMounted) setProperties(propMeta.data);
        }
        if (roomMeta?.data && Array.isArray(roomMeta.data) && roomMeta.data.length > 0) {
          if (isMounted) setRooms(roomMeta.data);
        }
      } catch (err) {
        console.warn("Error loading cached properties/rooms:", err);
      } finally {
        if (isMounted) setHydrated(true);
      }
    }

    loadCached();

    // ── 2. Real-time Firestore Listeners (Ensures live Firestore sync) ─────
    let unsubProps: (() => void) | undefined;
    let unsubRooms: (() => void) | undefined;

    try {
      unsubProps = onSnapshot(
        collection(db, "properties"),
        (snapshot) => {
          if (!snapshot.empty && isMounted) {
            const firestoreProps = snapshot.docs.map(
              (d) => ({ id: d.id, ...d.data() } as StoreProperty)
            );
            // Sort by order/id if needed
            setProperties(firestoreProps);
            IdbStorage.setWithMeta(PROP_KEY, firestoreProps).catch(() => {});
            IdbStorage.safeLocalSet(PROP_KEY, JSON.stringify(firestoreProps));
          } else if (snapshot.empty) {
            // Auto-seed Firestore if completely empty
            for (const p of DEFAULT_PROPERTIES) {
              setDoc(doc(db, "properties", p.id), p).catch(console.error);
            }
          }
        },
        (error) => {
          console.warn("Firestore properties listener warning:", error);
        }
      );

      unsubRooms = onSnapshot(
        collection(db, "rooms"),
        (snapshot) => {
          if (!snapshot.empty && isMounted) {
            const firestoreRooms = snapshot.docs.map(
              (d) => ({ id: d.id, ...d.data() } as StoreRoom)
            );
            setRooms(firestoreRooms);
            IdbStorage.setWithMeta(ROOM_KEY, firestoreRooms).catch(() => {});
            IdbStorage.safeLocalSet(ROOM_KEY, JSON.stringify(firestoreRooms));
          } else if (snapshot.empty) {
            // Auto-seed Firestore rooms if empty
            for (const r of DEFAULT_ROOMS) {
              setDoc(doc(db, "rooms", r.id), r).catch(console.error);
            }
          }
        },
        (error) => {
          console.warn("Firestore rooms listener warning:", error);
        }
      );
    } catch (err) {
      console.warn("Firestore subscription error:", err);
    }

    return () => {
      isMounted = false;
      if (unsubProps) unsubProps();
      if (unsubRooms) unsubRooms();
    };
  }, []);

  // ── Document size sanitization for Firestore (1MB limit protection) ────

  function sanitizePropertyForFirestore(p: Partial<StoreProperty>): Record<string, any> {
    const payload: Record<string, any> = { ...p };
    try {
      let raw = JSON.stringify(payload);
      if (raw.length > 700 * 1024 && Array.isArray(payload.images)) {
        const trimmed = [...payload.images];
        while (trimmed.length > 1 && JSON.stringify({ ...payload, images: trimmed }).length > 650 * 1024) {
          trimmed.pop();
        }
        payload.images = trimmed;
      }
    } catch {}
    return payload;
  }

  function sanitizeRoomForFirestore(r: Partial<StoreRoom>): Record<string, any> {
    const payload: Record<string, any> = { ...r };
    try {
      let raw = JSON.stringify(payload);
      if (raw.length > 700 * 1024 && Array.isArray(payload.images)) {
        const trimmed = [...payload.images];
        while (trimmed.length > 1 && JSON.stringify({ ...payload, images: trimmed }).length > 650 * 1024) {
          trimmed.pop();
        }
        payload.images = trimmed;
      }
    } catch {}
    return payload;
  }

  // ── Property actions ─────────────────────────────────────────────────────

  const addProperty = useCallback((p: Omit<StoreProperty, "id">): StoreProperty => {
    const created: StoreProperty = { ...p, id: `prop-${Date.now()}` };
    setProperties((prev) => [...prev, created]);
    const safePayload = sanitizePropertyForFirestore(created);
    setDoc(doc(db, "properties", created.id), safePayload).catch(console.error);
    return created;
  }, []);

  const updateProperty = useCallback((id: string, data: Partial<StoreProperty>) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...data };
          const safePayload = sanitizePropertyForFirestore(updated);
          setDoc(doc(db, "properties", id), safePayload, { merge: true }).catch(console.error);
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
    const safePayload = sanitizeRoomForFirestore(created);
    setDoc(doc(db, "rooms", id), safePayload).catch(console.error);
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
          const safePayload = sanitizeRoomForFirestore(updated);
          setDoc(doc(db, "rooms", id), safePayload, { merge: true }).catch(console.error);
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
