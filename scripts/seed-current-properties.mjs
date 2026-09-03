import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "lotus-paradise",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lotus-paradise.firebasestorage.app",
  });
}

const db = getFirestore();

export const CURRENT_PROPERTIES = [
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

export const CURRENT_ROOMS = [
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
];

async function seed() {
  console.log("Seeding properties...");
  for (const p of CURRENT_PROPERTIES) {
    await db.collection("properties").doc(p.id).set(p);
    console.log("Saved property:", p.name, "(id:", p.id, ")");
  }

  console.log("Seeding rooms...");
  // Clear any obsolete rooms
  const oldRooms = await db.collection("rooms").get();
  for (const d of oldRooms.docs) {
    await d.ref.delete();
  }
  for (const r of CURRENT_ROOMS) {
    await db.collection("rooms").doc(r.id).set(r);
    console.log("Saved room:", r.title, "(id:", r.id, ")");
  }

  console.log("Done seeding Firestore!");
}

seed().catch(console.error);
