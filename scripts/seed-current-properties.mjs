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
  {
    id: "room-1",
    propertyId: "prop-1",
    title: "Deluxe Mountain View Suite",
    slug: "deluxe-mountain-view-suite",
    type: "Deluxe Suite",
    pricePerNight: 4500,
    capacity: 2,
    quantity: 1,
    bedType: "King Bed",
    view: "Panoramic Kanchenjunga & Forest Valley View",
    size: "380 sq ft",
    location: "Latpanchar, North Bengal",
    description:
      "Our signature deluxe suite features private teak wood veranda overlooking the snow-capped Himalayan ranges, bespoke hand-carved furnishings, electric blanket warming, and attached marble bathroom with instant geyser.",
    amenities: [
      "Kanchenjunga Balcony",
      "Complimentary Gourmet Breakfast",
      "High-Speed WiFi",
      "Electric Kettle & Herbal Teas",
      "Electric Bed Warmer",
      "Geyser & Organic Toiletries",
    ],
    images: [
      "/images/rooms/room1.jpg",
      "/images/rooms/room2.jpg",
    ],
    featured: true,
    available: true,
  },
  {
    id: "room-2",
    propertyId: "prop-1",
    title: "Kanchenjunga Grand Deluxe Suite",
    slug: "kanchenjunga-grand-deluxe-suite",
    type: "Premium Suite",
    pricePerNight: 5500,
    capacity: 3,
    quantity: 1,
    bedType: "King Bed + Plush Daybed",
    view: "Panoramic Kanchenjunga & Forest Valley View",
    size: "440 sq ft",
    location: "Latpanchar, North Bengal",
    description:
      "A grand mountain suite with 180-degree unobstructed sunrise views, luxury daybed, and authentic colonial decor.",
    amenities: [
      "Panoramic Sunrise Veranda",
      "Complimentary Gourmet Breakfast",
      "High-Speed WiFi",
      "Electric Kettle & Darjeeling Tea",
      "Electric Bed Warmer",
      "Instant Hot Geyser",
    ],
    images: [
      "/images/rooms/room2.jpg",
      "/images/rooms/room3.jpg",
    ],
    featured: true,
    available: true,
  },
  {
    id: "room-3",
    propertyId: "prop-1",
    title: "Heritage Family Duplex Suite",
    slug: "heritage-family-duplex-suite",
    type: "Family Suite",
    pricePerNight: 6500,
    capacity: 5,
    quantity: 1,
    bedType: "2 Queen Beds + Sofa Sitting",
    view: "Valley Garden & Pine Forest View",
    size: "580 sq ft",
    location: "Latpanchar, North Bengal",
    description:
      "Designed for families and groups seeking spacious comfort. Features two separate bedroom spaces, traditional wooden paneling, private seating lounge, and garden access.",
    amenities: [
      "Two Queen Beds",
      "Garden Access Veranda",
      "Complimentary Breakfast for 5",
      "Free High-Speed WiFi",
      "Geyser & Premium Toiletries",
    ],
    images: [
      "/images/rooms/room3.jpg",
      "/images/rooms/room4.jpeg",
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
