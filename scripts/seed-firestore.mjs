import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

// Load environment variables
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

// ─────────────────────────────────────────────────────────────────────────────
// DATA DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const PROPERTIES = [
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

const ROOMS = [
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
    images: ["/images/rooms/room1.jpg", "/images/rooms/room2.jpg"],
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
    images: ["/images/rooms/room2.jpg", "/images/rooms/room3.jpg"],
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
    images: ["/images/rooms/room3.jpg", "/images/rooms/room4.jpeg"],
    featured: true,
    available: true,
  },
];

const HERO_SLIDES = [
  {
    id: "slide-1",
    title: "New Himalayan Horizon",
    subtitle: "A Luxury Mountain Retreat in Latpanchar, North Bengal",
    location: "Latpanchar, Mahananda Wildlife Sanctuary (4,500 ft)",
    desktopImage: "/images/hero/himalayan-horizon-view.jpeg",
    mobileImage: "/images/hero/himalayan-horizon-view.jpeg",
    badge: "Colonial Charm",
    video: "",
    overlayOpacity: 0.5,
    textAlignment: "left",
    buttonText: "Book Your Stay",
    buttonLink: "/booking",
    active: true,
    displayOrder: 1,
  },
  {
    id: "slide-2",
    title: "Colonial Charm Meets Mountain Calm",
    subtitle: "Experience Authentic Bengali Hospitality & Panoramic Verandas",
    location: "Lotus Paradise Homestay",
    desktopImage: "/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg",
    mobileImage: "/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg",
    badge: "Home Away From Home",
    video: "",
    overlayOpacity: 0.5,
    textAlignment: "left",
    buttonText: "Explore Suites",
    buttonLink: "/rooms",
    active: true,
    displayOrder: 2,
  },
  {
    id: "slide-3",
    title: "Warm Bonfires Under Himalayan Skies",
    subtitle: "Gather round the fire with hot local tea, acoustic tunes & starry nights",
    location: "Latpanchar Garden Veranda",
    desktopImage: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    mobileImage: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    badge: "Memorable Evenings",
    video: "",
    overlayOpacity: 0.5,
    textAlignment: "left",
    buttonText: "View Experiences",
    buttonLink: "/experiences",
    active: true,
    displayOrder: 3,
  },
  {
    id: "slide-4",
    title: "The Hornbill Sanctuary of North Bengal",
    subtitle: "Spot the magnificent Rufous-necked Hornbill right outside your window",
    location: "Mahananda Upper Forest",
    desktopImage: "/images/hero/bengal-latpanchar-rufous-necked-hornbill-pair-parag-gurung-1_egnyvn-1024x744.jpg.jpeg",
    mobileImage: "/images/hero/bengal-latpanchar-rufous-necked-hornbill-pair-parag-gurung-1_egnyvn-1024x744.jpg.jpeg",
    badge: "Birdwatcher's Paradise",
    video: "",
    overlayOpacity: 0.5,
    textAlignment: "left",
    buttonText: "Guided Birding Tour",
    buttonLink: "/experiences",
    active: true,
    displayOrder: 4,
  },
  {
    id: "slide-5",
    title: "Sweet Fragrance of Sittong Orange Groves",
    subtitle: "Wander through golden orchards cascading down verdant mountain slopes",
    location: "Sittong & Latpanchar Valleys",
    desktopImage: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
    mobileImage: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
    badge: "Nature & Harvest",
    video: "",
    overlayOpacity: 0.5,
    textAlignment: "left",
    buttonText: "Plan Sittong Trip",
    buttonLink: "/contact",
    active: true,
    displayOrder: 5,
  },
  {
    id: "slide-6",
    title: "Sanctuary of Comfort & Warm Elegance",
    subtitle: "Thoughtfully crafted mountain suites featuring panoramic Himalayan balconies",
    location: "Deluxe Suite Veranda",
    desktopImage: "/images/hero/b.jpg.jpg.jpeg",
    mobileImage: "/images/hero/b.jpg.jpg.jpeg",
    badge: "Refined Luxury",
    video: "",
    overlayOpacity: 0.5,
    textAlignment: "left",
    buttonText: "Reserve Now",
    buttonLink: "/booking",
    active: true,
    displayOrder: 6,
  },
];

const GALLERY = [
  {
    id: "gal-1",
    title: "Kanchenjunga Golden Sunrise",
    category: "Sunrise",
    imageUrl: "/images/hero/bengal-latpanchar.jpg.jpeg",
    altText: "Golden sunrise illuminating Kanchenjunga peak from Latpanchar",
    width: 1920,
    height: 1080,
    location: "Latpanchar, North Bengal",
    photographer: "Lotus Paradise Desk",
    tags: ["sunrise", "kanchenjunga", "latpanchar"],
    featured: true,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "gal-2",
    title: "Rufous-necked Hornbill Pair",
    category: "Birding",
    imageUrl: "/images/hero/bengal-latpanchar-rufous-necked-hornbill-pair-parag-gurung-1_egnyvn-1024x744.jpg.jpeg",
    altText: "Pair of Rufous-necked Hornbills perched on branch",
    width: 1024,
    height: 744,
    location: "Mahananda Sanctuary",
    photographer: "Parag Gurung",
    tags: ["birding", "hornbill", "wildlife"],
    featured: true,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "gal-3",
    title: "Colonial Suite Veranda",
    category: "Rooms",
    imageUrl: "/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg",
    altText: "Luxury bedroom interior with mountain view veranda",
    width: 1920,
    height: 1080,
    location: "Lotus Paradise Homestay",
    photographer: "Lotus Paradise Desk",
    tags: ["rooms", "luxury", "interior"],
    featured: true,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "gal-4",
    title: "Cosy Evening Bonfire",
    category: "Events",
    imageUrl: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    altText: "Guest bonfire night at Lotus Paradise Homestay lawn",
    width: 1920,
    height: 1080,
    location: "Garden Lawn",
    photographer: "Lotus Paradise Desk",
    tags: ["bonfire", "events", "night"],
    featured: true,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "gal-5",
    title: "Fresh Himalayan Orange Harvest",
    category: "Nature",
    imageUrl: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
    altText: "Orange trees laden with ripe fruit in Sittong",
    width: 1920,
    height: 1080,
    location: "Sittong Orange Valley",
    photographer: "Lotus Paradise Desk",
    tags: ["sittong", "oranges", "harvest"],
    featured: true,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "gal-6",
    title: "Authentic Bengali Cuisine Feast",
    category: "Food",
    imageUrl: "/images/hero/13.jpg.jpeg",
    altText: "Traditional homestay dining setup with authentic delicacies",
    width: 1920,
    height: 1080,
    location: "Lotus Dining Hall",
    photographer: "Lotus Paradise Chef",
    tags: ["food", "bengali", "organic"],
    featured: true,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "gal-7",
    title: "Mahananda Sanctuary Forest Canopy",
    category: "Nature",
    imageUrl: "/images/hero/mahananda-wildlife-sanctuary-siliguri2-attr-hero.jpe",
    altText: "Dense green forest canopy in upper Latpanchar",
    width: 1920,
    height: 1080,
    location: "Mahananda Wildlife Sanctuary",
    photographer: "Lotus Paradise Desk",
    tags: ["forest", "sanctuary", "nature"],
    featured: true,
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "gal-8",
    title: "Rare Himalayan Songbird",
    category: "Birding",
    imageUrl: "/images/hero/images (1).jpe",
    altText: "Songbird perched in mossy branches",
    width: 1200,
    height: 800,
    location: "Latpanchar Trail",
    photographer: "Lotus Paradise Desk",
    tags: ["songbird", "birding", "himalayas"],
    featured: true,
    uploadedAt: new Date().toISOString(),
  },
];

const EXPERIENCES = [
  {
    id: "exp-1",
    title: "Birding Paradise Walk",
    slug: "birding-paradise-walk",
    shortDesc: "Wake before sunrise as the untouched forests of Latpanchar come alive with rare Himalayan species.",
    fullDesc:
      "Accompanied by our expert local naturalist, venture into the Mahananda Upper Reserve to spot the rare Rufous-necked Hornbill, Wren-Babblers, and Sunbirds in their natural habitat. Photography hides and optic telescopes provided.",
    duration: "3 - 4 Hours",
    bestTime: "6:00 AM – 9:30 AM",
    image: "/images/hero/bengal-latpanchar-rufous-necked-hornbill-pair-parag-gurung-1_egnyvn-1024x744.jpg.jpeg",
    highlights: [
      "Hornbill Nest Spotting",
      "Expert Local Naturalist Guide",
      "Binocular & Scope Support",
      "Fresh Morning Darjeeling Tea in Forest",
    ],
    featured: true,
  },
  {
    id: "exp-2",
    title: "Sittong Orange Garden Harvest",
    slug: "orange-garden-harvest",
    shortDesc: "Stroll through golden orange orchards in Sittong valley and taste freshly handpicked organic oranges.",
    fullDesc:
      "A short scenic drive takes you into Sittong, famous as the Orange Village of Bengal. Walk through cascading orchards, interact with local villagers, and enjoy freshly squeezed orange juice straight from the trees.",
    duration: "2 - 3 Hours",
    bestTime: "October – January",
    image: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
    highlights: [
      "Direct Orchard Harvesting",
      "Fresh Organic Juice Tasting",
      "Scenic Sittong Valley Drive",
      "Village Photo Ops",
    ],
    featured: true,
  },
  {
    id: "exp-3",
    title: "Ahaldhara Stargazing & Bonfire Night",
    slug: "ahaldhara-stargazing-bonfire",
    shortDesc: "Gather round warm wood fires as evening acoustic tunes echo under crisp Himalayan starry skies.",
    fullDesc:
      "As night falls over Latpanchar, enjoy a private bonfire set up on our lawn or Ahaldhara ridge. Sip hot authentic Bengali spiced tea or cocoa, relish local barbecued delicacies, and gaze at unpolluted starry constellations.",
    duration: "Evening Activity",
    bestTime: "7:00 PM – 10:00 PM",
    image: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    highlights: [
      "Wood-Fired Bonfire",
      "Barbecue & Local Delicacies",
      "Stargazing Telescope Setup",
      "Traditional Acoustic Music",
    ],
    featured: true,
  },
  {
    id: "exp-4",
    title: "Cinchona Heritage & Photography Trail",
    slug: "cinchona-heritage-photography-trail",
    shortDesc: "Explore 150-year-old British colonial Cinchona plantations and Latkothi heritage bungalow.",
    fullDesc:
      "Latpanchar was developed during British rule for Cinchona cultivation (source of Quinine). Walk through old processing trails, misty pine avenues, and majestic viewpoints ideal for landscape photography.",
    duration: "2 Hours",
    bestTime: "Morning or Late Afternoon",
    image: "/images/hero/bengal-latpanchar.jpg.jpeg",
    highlights: [
      "Latkothi Heritage Villa",
      "Colonial History Stories",
      "Pine Forest Mist Trails",
      "Panoramic Ridge Views",
    ],
    featured: true,
  },
];

const ATTRACTIONS = [
  {
    id: "attr-1",
    name: "Ahaldhara Viewpoint",
    distance: "5 km",
    driveTime: "15 mins",
    description: "Perched at 4,800 ft, offering a breathtaking 360-degree view of Kanchenjunga, Teesta river curve, and Gangtok ridge.",
    image: "/images/hero/bengal-latpanchar.jpg.jpeg",
    coordinates: { lat: 26.921, lng: 88.412 },
  },
  {
    id: "attr-2",
    name: "Namthing Pokhri Lake",
    distance: "4 km",
    driveTime: "12 mins",
    description: "A natural high-altitude seasonal lake enclosed by pine trees, famous for breeding rare Himalayan Salamanders (Tylototriton verrucosus).",
    image: "/images/hero/mahananda-wildlife-sanctuary-siliguri2-attr-hero.jpe",
    coordinates: { lat: 26.915, lng: 88.405 },
  },
  {
    id: "attr-3",
    name: "Sittong Orange Village",
    distance: "9 km",
    driveTime: "25 mins",
    description: "Picturesque valley famous for vast orange groves, traditional wooden homes, and tranquil mountain streams.",
    image: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
    coordinates: { lat: 26.935, lng: 88.385 },
  },
  {
    id: "attr-4",
    name: "Latkothi Heritage Bungalow",
    distance: "2 km",
    driveTime: "5 mins",
    description: "Historical British-era inspection bungalow surrounded by thick pine and cinchona plantations with sweeping valley views.",
    image: "/images/hero/b.jpg.jpg.jpeg",
    coordinates: { lat: 26.918, lng: 88.42 },
  },
  {
    id: "attr-5",
    name: "Mahananda Wildlife Sanctuary",
    distance: "0 km (Adjacent)",
    driveTime: "0 mins",
    description: "Located right at the edge of the sanctuary's upper core area, rich in Asian elephants, leopards, and over 240 bird species.",
    image: "/images/hero/mahananda-wildlife-sanctuary-siliguri2-attr-hero.jpe",
    coordinates: { lat: 26.91, lng: 88.425 },
  },
];

const BIRDS = [
  {
    id: "bird-1",
    name: "Rufous-necked Hornbill",
    scientificName: "Aceros nipalensis",
    description: "The crown jewel of Latpanchar. Latpanchar is one of the very few accessible nesting grounds in India for this globally threatened species.",
    rarity: "Vulnerable",
    bestViewingMonths: "March – May & Sept – Nov",
    image: "/images/hero/bengal-latpanchar-rufous-necked-hornbill-pair-parag-gurung-1_egnyvn-1024x744.jpg.jpeg",
  },
  {
    id: "bird-2",
    name: "Rufous-throated Wren-Babbler",
    scientificName: "Spelaeornis caudatus",
    description: "A secretive, rare songbird of the dense Himalayan undergrowth. Known for its melodious trill echoed along Latpanchar forest trails.",
    rarity: "Rare",
    bestViewingMonths: "October – April",
    image: "/images/hero/images (1).jpe",
  },
  {
    id: "bird-3",
    name: "Black-chinned Yuhina",
    scientificName: "Yuhina nigrimenta",
    description: "Small, energetic crested birds traveling in noisy flocks across the Cinchona and pine canopy of Latkothi.",
    rarity: "Abundant",
    bestViewingMonths: "Year Round",
    image: "/images/hero/images (2).jpe",
  },
  {
    id: "bird-4",
    name: "Emerald Dove & Sunbirds",
    scientificName: "Chalcophaps indica",
    description: "Vibrant emerald green wings that flash across mossy forest glades during early morning walking trails.",
    rarity: "Sought-After",
    bestViewingMonths: "October – May",
    image: "/images/hero/images (3).jpe",
  },
];

const TESTIMONIALS = [
  {
    id: "test-1",
    guestName: "Anirban & Swati Roy",
    location: "Kolkata, West Bengal",
    rating: 5,
    date: "November 2025",
    comment:
      "Lotus Paradise exceeded all expectations! The view of Kanchenjunga right from our bed at sunrise was magical. The home-cooked Bengali thali, fresh fish, and warm hospitality made us feel like family.",
    avatar: "/images/hero/images (2).jpe",
  },
  {
    id: "test-2",
    guestName: "Dr. Richard & Sarah Miller",
    location: "London, UK",
    rating: 5,
    date: "March 2025",
    comment:
      "As avid birdwatchers, Latpanchar was on our bucket list for years. The homestay's naturalist helped us spot the Rufous-necked Hornbill within 2 hours of arrival! Immaculate cleanliness, hot bed warmers, and stunning tea.",
    avatar: "/images/hero/images (3).jpe",
  },
  {
    id: "test-3",
    guestName: "Vikram & Neha Sharma",
    location: "Bengaluru, India",
    rating: 5,
    date: "December 2025",
    comment:
      "We hosted our corporate leadership retreat here. The bonfire evenings, drone views, quiet atmosphere, and seamless WiFi allowed us to bond deeply away from noisy city boardrooms.",
    avatar: "/images/hero/images (1).jpe",
  },
];

const FAQS = [
  {
    id: "faq-1",
    question: "How do I reach Lotus Paradise Homestay in Latpanchar?",
    answer:
      "Latpanchar is located approximately 42 km from NJP Railway Station and 48 km from Bagdogra Airport (IXB). We can arrange private luxury pickup cabs (Innova / Xylo) directly to our doorstep.",
    category: "Location & Travel",
    order: 1,
  },
  {
    id: "faq-2",
    question: "What is the best time to visit for Kanchenjunga views and Birdwatching?",
    answer:
      "For crystal-clear Kanchenjunga peaks, October to January is ideal. For rare Rufous-necked Hornbill nesting and vibrant forest blooms, March to May is magnificent.",
    category: "Best Season",
    order: 2,
  },
  {
    id: "faq-3",
    question: "Are all meals included in the stay package?",
    answer:
      "Gourmet home-cooked breakfast is complimentary with all room bookings. We also serve authentic organic Bengali lunches, evening snacks with tea/coffee, and warm dinner thalis prepared fresh upon request.",
    category: "Dining & Food",
    order: 3,
  },
  {
    id: "faq-4",
    question: "Is high-speed internet/WiFi available for remote work?",
    answer:
      "Yes! We provide optical fiber high-speed WiFi across all rooms, common verandas, and dining areas, making Lotus Paradise ideal for workcations and corporate retreats.",
    category: "Amenities",
    order: 4,
  },
  {
    id: "faq-5",
    question: "How do we arrange guided birdwatching & local sightseeing?",
    answer:
      "Our team includes certified local naturalists and experienced drivers. You can book custom birdwatching walks, Sittong orange farm tours, and Ahaldhara sunrise trips directly at our desk.",
    category: "Activities",
    order: 5,
  },
];

const BLOGS = [
  {
    id: "post-1",
    title: "Complete Bird Watching Guide to Latpanchar: Spotting the Rufous-necked Hornbill",
    slug: "latpanchar-bird-watching-guide-rufous-necked-hornbill",
    excerpt: "Discover why Latpanchar is India's premier sanctuary for sighting the globally threatened Rufous-necked Hornbill.",
    content: "Latpanchar sits at an altitude of 4,500 feet inside the upper reaches of Mahananda Wildlife Sanctuary...",
    coverImage: "/images/hero/bengal-latpanchar-rufous-necked-hornbill-pair-parag-gurung-1_egnyvn-1024x744.jpg.jpeg",
    category: "Birding Guide",
    readTime: "6 min read",
    publishedAt: "2026-01-15",
  },
  {
    id: "post-2",
    title: "Best Time to Visit Latpanchar & Sittong Valley: A Season-by-Season Overview",
    slug: "best-time-to-visit-latpanchar-sittong-valley",
    excerpt: "Planning your mountain getaway? Learn what each season in Latpanchar offers, from autumn sunrise views to spring blooms.",
    content: "Nestled in the Kurseong hill division of Darjeeling district...",
    coverImage: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
    category: "Travel Tips",
    readTime: "5 min read",
    publishedAt: "2026-02-01",
  },
  {
    id: "post-3",
    title: "Why Corporate Teams Are Swapping City Hotels for Mountain Offsites in North Bengal",
    slug: "corporate-retreats-in-north-bengal-himalayas",
    excerpt: "How nature-immersed retreats in Latpanchar foster authentic team bonding, strategic clarity, and reduced burnout.",
    content: "Modern companies are realizing that luxury is not just plush velvet walls...",
    coverImage: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    category: "Corporate Retreats",
    readTime: "7 min read",
    publishedAt: "2026-02-10",
  },
];

const SITE_SETTINGS_GENERAL = {
  phone1: "+91 98320 12345",
  phone2: "+91 97323 00111",
  phone3: "+91 92427 96931",
  phone4: "+91 76999 93099",
  whatsappNumber: "+919832012345",
  email: "stay@lotusparadisehomestay.com",
  address: "Upper Latpanchar Forest Road, Kurseong Division, Darjeeling District, West Bengal - 734008",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.123456789!2d88.412!3d26.921",
  seoKeywords: "Latpanchar Homestay, Rufous-necked Hornbill, Kanchenjunga View, Sittong Orange Orchards, Darjeeling Retreat",
  heroSubtitle: "A Luxury Mountain Retreat in Latpanchar, North Bengal (4,500 ft)",
  updatedAt: new Date().toISOString(),
};

const HOMEPAGE_SECTIONS = [
  { id: "hero", name: "Cinematic Hero Banner", enabled: true, order: 1 },
  { id: "weather", name: "Latpanchar Altitude & Weather Widget", enabled: true, order: 2 },
  { id: "properties", name: "Our Mountain Properties", enabled: true, order: 3 },
  { id: "about", name: "Storytelling About Section", enabled: true, order: 4 },
  { id: "whyChooseUs", name: "Why Choose Us Luxury Cards", enabled: true, order: 5 },
  { id: "birds", name: "Mahananda Sanctuary Avian Treasures", enabled: true, order: 6 },
  { id: "seasonal", name: "Seasonal Visit Guide", enabled: true, order: 7 },
  { id: "experiences", name: "Signature Experiences Story Cards", enabled: true, order: 8 },
  { id: "rooms", name: "Luxury Mountain Suites Showcase", enabled: true, order: 9 },
  { id: "corporate", name: "Corporate Offsite Retreat Section", enabled: true, order: 10 },
  { id: "attractions", name: "Nearby Attractions & Interactive Map", enabled: true, order: 11 },
  { id: "gallery", name: "Pinterest Masonry Gallery", enabled: true, order: 12 },
  { id: "testimonials", name: "Google Verified Reviews & Ratings", enabled: true, order: 13 },
  { id: "faq", name: "Frequently Asked Questions Accordion", enabled: true, order: 14 },
];

const INITIAL_BOOKINGS = [
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
    checkIn: "2026-09-15",
    checkOut: "2026-09-18",
    nights: 3,
    guestsCount: 2,
    specialRequests: "High floor balcony view, vegetarian breakfast",
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
    checkIn: "2026-09-20",
    checkOut: "2026-09-23",
    nights: 3,
    guestsCount: 4,
    specialRequests: "Birding guide needed for morning walks",
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
    checkIn: "2026-09-25",
    checkOut: "2026-09-27",
    nights: 2,
    guestsCount: 2,
    specialRequests: "Anniversary setup with candlelit dinner",
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

const INITIAL_ENQUIRIES = [
  {
    id: "enq-1",
    name: "Siddharth Roy",
    email: "siddharth@example.com",
    phone: "+91 98301 99887",
    subject: "Latpanchar Hornbill Tour Package",
    message: "Hello, we are a group of 4 photographers visiting in October. Do you arrange local cab pickup from NJP station?",
    status: "UNREAD",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_CORPORATE_LEADS = [
  {
    id: "corp-1",
    company: "TechNova Analytics",
    contactPerson: "Rahul Sengupta",
    email: "rahul@technova.io",
    phone: "+91 98765 43210",
    employeesCount: 16,
    preferredDates: "Oct 12 - Oct 15, 2026",
    budgetRange: "₹2.5L - ₹3L",
    requirements: "Strategy offsite, bonfire night, guided birding hike, audio-visual setup.",
    status: "NEW",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New Reservation Request from Anirban Roy (LPH-849201)",
    type: "BOOKING",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    detailsUrl: "/admin/bookings",
  },
  {
    id: "notif-2",
    title: "New Corporate Offsite Inquiry from TechNova Analytics",
    type: "CORPORATE_LEAD",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    detailsUrl: "/admin/corporate-leads",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEEDING EXECUTION
// ─────────────────────────────────────────────────────────────────────────────

async function seedCollection(collectionName, items) {
  console.log(`⏳ Seeding collection: '${collectionName}' (${items.length} docs)...`);
  const batch = db.batch();

  for (const item of items) {
    const docRef = db.collection(collectionName).doc(item.id);
    batch.set(docRef, item, { merge: true });
  }

  await batch.commit();
  console.log(`✅ Collection '${collectionName}' successfully seeded!`);
}

async function runSeed() {
  console.log("=================================================");
  console.log("🚀 Starting Firestore Seeding for Lotus Paradise");
  console.log(`📦 Project ID: ${serviceAccount.projectId}`);
  console.log("=================================================\n");

  try {
    // 1. Properties
    await seedCollection("properties", PROPERTIES);

    // 2. Rooms
    await seedCollection("rooms", ROOMS);

    // 3. Hero Slides
    await seedCollection("heroSlides", HERO_SLIDES);

    // 4. Gallery
    await seedCollection("gallery", GALLERY);

    // 5. Experiences
    await seedCollection("experiences", EXPERIENCES);

    // 6. Attractions
    await seedCollection("attractions", ATTRACTIONS);

    // 7. Rare Birds
    await seedCollection("birds", BIRDS);

    // 8. Testimonials
    await seedCollection("testimonials", TESTIMONIALS);

    // 9. FAQs
    await seedCollection("faqs", FAQS);

    // 10. Blogs
    await seedCollection("blogs", BLOGS);

    // 11. Site Settings
    console.log("⏳ Seeding siteSettings (general & weather)...");
    await db.collection("siteSettings").doc("general").set(SITE_SETTINGS_GENERAL, { merge: true });
    console.log("✅ siteSettings seeded!");

    // 12. Homepage Sections
    console.log("⏳ Seeding homepageSections...");
    await db.collection("homepageSections").doc("config").set({ sections: HOMEPAGE_SECTIONS }, { merge: true });
    console.log("✅ homepageSections seeded!");

    // 13. Bookings
    await seedCollection("bookings", INITIAL_BOOKINGS);

    // 14. Enquiries
    await seedCollection("enquiries", INITIAL_ENQUIRIES);

    // 15. Corporate Leads
    await seedCollection("corporateLeads", INITIAL_CORPORATE_LEADS);

    // 16. Notifications
    await seedCollection("notifications", INITIAL_NOTIFICATIONS);

    console.log("\n=================================================");
    console.log("🎉 ALL DATA SEEDED SUCCESSFULLY TO FIRESTORE!");
    console.log("=================================================");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

runSeed();
