export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  image: string;
  badge: string;
}

export interface BirdSpecies {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  rarity: "Rare" | "Vulnerable" | "Abundant" | "Sought-After";
  bestViewingMonths: string;
  image: string;
}

export interface RoomData {
  id: string;
  title: string;
  slug: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  view: string;
  size: string;
  description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
}

export interface ExperienceData {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  bestTime: string;
  image: string;
  highlights: string[];
  featured: boolean;
}

export interface AttractionData {
  id: string;
  name: string;
  distance: string;
  driveTime: string;
  description: string;
  image: string;
  coordinates: { lat: number; lng: number };
}

export interface GalleryData {
  id: string;
  title: string;
  category: "Nature" | "Rooms" | "Food" | "Events" | "Birding" | "Sunrise" | "Guests";
  imageUrl: string;
  altText: string;
}

export interface TestimonialData {
  id: string;
  guestName: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  readTime: string;
  publishedAt: string;
}

// -------------------------------------------------------------
// HERO SLIDES
// -------------------------------------------------------------
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Wake Up To The Mighty Kanchenjunga",
    subtitle: "A Luxury Mountain Retreat in Latpanchar, North Bengal",
    location: "Latpanchar, Mahananda Wildlife Sanctuary (4,500 ft)",
    image: "/images/hero/bengal-latpanchar.jpg.jpeg",
    badge: "Darjeeling Colonial Heritage",
  },
  {
    id: "slide-2",
    title: "Colonial Charm Meets Mountain Calm",
    subtitle: "Experience Authentic Bengali Hospitality & Panoramic Verandas",
    location: "Lotus Paradise Homestay",
    image: "/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg",
    badge: "Home Away From Home",
  },
  {
    id: "slide-3",
    title: "Warm Bonfires Under Himalayan Skies",
    subtitle: "Gather round the fire with hot local tea, acoustic tunes & starry nights",
    location: "Latpanchar Garden Veranda",
    image: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    badge: "Memorable Evenings",
  },
  {
    id: "slide-4",
    title: "The Hornbill Sanctuary of North Bengal",
    subtitle: "Spot the magnificent Rufous-necked Hornbill right outside your window",
    location: "Mahananda Upper Forest",
    image: "/images/hero/bengal-latpanchar-rufous-necked-hornbill-pair-parag-gurung-1_egnyvn-1024x744.jpg.jpeg",
    badge: "Birdwatcher's Paradise",
  },
  {
    id: "slide-5",
    title: "Sweet Fragrance of Sittong Orange Groves",
    subtitle: "Wander through golden orchards cascading down verdant mountain slopes",
    location: "Sittong & Latpanchar Valleys",
    image: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
    badge: "Nature & Harvest",
  },
  {
    id: "slide-6",
    title: "Sanctuary of Comfort & Warm Elegance",
    subtitle: "Thoughtfully crafted mountain suites featuring panoramic Himalayan balconies",
    location: "Deluxe Suite Veranda",
    image: "/images/hero/b.jpg.jpg.jpeg",
    badge: "Refined Luxury",
  },
];

// -------------------------------------------------------------
// LATPANCHAR WEATHER MOCK
// -------------------------------------------------------------
export const LATPANCHAR_WEATHER = {
  altitude: "4,500 ft (1,371m)",
  location: "Latpanchar, Kurseong Division",
  temp: "19°C",
  condition: "Pleasant Mountain Breeze",
  humidity: "68%",
  kanchenjungaVisibility: "92% Clear Sunrise Expected",
  airQuality: "Pristine (AQI 14)",
};

// -------------------------------------------------------------
// LOCAL BIRDS SHOWCASE
// -------------------------------------------------------------
export const RARE_BIRDS: BirdSpecies[] = [
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

// -------------------------------------------------------------
// SEASONAL VISIT GUIDE
// -------------------------------------------------------------
export const SEASONAL_GUIDE = [
  {
    season: "Spring",
    months: "March – May",
    temp: "14°C – 22°C",
    highlight: "Hornbill Nesting & Rhododendrons",
    description: "The forest erupts in vibrant floral blooms. Female Hornbills nest in high hollow tree trunks while male Hornbills feed them.",
    recommendedFor: "Birdwatchers, Photographers, Couples",
  },
  {
    season: "Summer",
    months: "June",
    temp: "18°C – 24°C",
    highlight: "Pleasant Mountain Retreat",
    description: "Escape the heat of the plains. Lush green mist rolls through the cinchona plantations, creating crisp morning walks.",
    recommendedFor: "Family Holidays, Corporate Offsites",
  },
  {
    season: "Monsoon",
    months: "July – September",
    temp: "16°C – 21°C",
    highlight: "Romantic Mist & Waterfall Trails",
    description: "Dramatic cloudscapes, roaring mountain streams, and deep emerald vegetation. Pure tranquility and hot Bengali tea by the window.",
    recommendedFor: "Writers, Artists, Nature Lovers",
  },
  {
    season: "Autumn",
    months: "October – November",
    temp: "12°C – 19°C",
    highlight: "Crystal Clear Kanchenjunga Views & Orange Harvest",
    description: "The golden season. Zero haze reveals panoramic snow peaks of Kanchenjunga while orange orchards in nearby Sittong ripen.",
    recommendedFor: "Sightseeing, Sunrise Enthusiasts, Trekkers",
  },
  {
    season: "Winter",
    months: "December – February",
    temp: "6°C – 15°C",
    highlight: "Cosy Bonfires & Crisp Peak Panoramas",
    description: "Chilly crisp air, starry nights, wood-fired barbecues, and golden morning sunlight illuminating frost-tipped pine needles.",
    recommendedFor: "Bonfire Nights, Family Reunions",
  },
];

// -------------------------------------------------------------
// ROOMS DATA
// -------------------------------------------------------------
export const ROOMS: RoomData[] = [
  {
    id: "room-1",
    title: "Kanchenjunga Grand Deluxe Suite",
    slug: "kanchenjunga-grand-deluxe-suite",
    type: "Deluxe Suite",
    pricePerNight: 4800,
    capacity: 3,
    bedType: "King Bed + Plush Daybed",
    view: "Panoramic Kanchenjunga & Forest Valley View",
    size: "420 sq ft",
    description: "Our signature luxury suite features a private teak wood balcony overlooking the snow-capped Himalayan ranges, bespoke hand-carved furnishings, electric blanket warming, and attached marble bathroom with instant geyser.",
    amenities: [
      "Kanchenjunga Balcony",
      "Complimentary Gourmet Breakfast",
      "High-Speed WiFi",
      "Electric Kettle & Herbal Teas",
      "Electric Bed Warmer",
      "Geyser & Organic Toiletries",
      "Intercom & Room Service",
      "Wide Screen Smart TV",
    ],
    images: [
      "/images/rooms/room1.jpg",
      "/images/rooms/room2.jpg",
    ],
    featured: true,
  },
  {
    id: "room-2",
    title: "Heritage Family Duplex Suite",
    slug: "heritage-family-duplex-suite",
    type: "Family Suite",
    pricePerNight: 6500,
    capacity: 5,
    bedType: "2 Queen Beds + Sofa Sitting",
    view: "Valley Garden & Pine Forest View",
    size: "580 sq ft",
    description: "Designed for families and groups seeking spacious comfort. Features two separate bedroom spaces, traditional wooden paneling, private seating lounge, and garden access.",
    amenities: [
      "Two Queen Beds",
      "Garden Access Veranda",
      "Complimentary Breakfast for 4",
      "Free High-Speed WiFi",
      "Geyser & Premium Toiletries",
      "Electric Kettles",
      "Daily Room Cleaning",
      "Dining Area",
    ],
    images: [
      "/images/rooms/room2.jpg",
      "/images/rooms/room3.jpg",
    ],
    featured: true,
  },
  {
    id: "room-3",
    title: "Colonial Couple Retreat",
    slug: "colonial-couple-retreat",
    type: "Couple Room",
    pricePerNight: 3900,
    capacity: 2,
    bedType: "Queen Canopy Bed",
    view: "Mist Forest & Sunrise View",
    size: "340 sq ft",
    description: "An intimate, romantic haven designed with warm ivory tones, colonial lamps, plush bedding, and floor-to-ceiling glass windows framing morning Himalayan mist.",
    amenities: [
      "Canopy Queen Bed",
      "Private Sunrise Deck",
      "Complimentary Breakfast",
      "Free WiFi",
      "Electric Kettle & Organic Darjeeling Tea",
      "Luxury Bath Amenities",
    ],
    images: [
      "/images/rooms/room3.jpg",
      "/images/rooms/room4.jpeg",
    ],
    featured: true,
  },
];

// -------------------------------------------------------------
// EXPERIENCES
// -------------------------------------------------------------
export const EXPERIENCES: ExperienceData[] = [
  {
    id: "exp-1",
    title: "Birding Paradise Walk",
    slug: "birding-paradise-walk",
    shortDesc: "Wake before sunrise as the untouched forests of Latpanchar come alive with rare Himalayan species.",
    fullDesc: "Accompanied by our expert local naturalist, venture into the Mahananda Upper Reserve to spot the rare Rufous-necked Hornbill, Wren-Babblers, and Sunbirds in their natural habitat. Photography hides and optic telescopes provided.",
    duration: "3 - 4 Hours",
    bestTime: "6:00 AM – 9:30 AM",
    image: "/images/hero/bengal-latpanchar-rufous-necked-hornbill-pair-parag-gurung-1_egnyvn-1024x744.jpg.jpeg",
    highlights: ["Hornbill Nest Spotting", "Expert Local Naturalist Guide", "Binocular & Scope Support", "Fresh Morning Darjeeling Tea in Forest"],
    featured: true,
  },
  {
    id: "exp-2",
    title: "Sittong Orange Garden Harvest",
    slug: "orange-garden-harvest",
    shortDesc: "Stroll through golden orange orchards in Sittong valley and taste freshly handpicked organic oranges.",
    fullDesc: "A short scenic drive takes you into Sittong, famous as the Orange Village of Bengal. Walk through cascading orchards, interact with local villagers, and enjoy freshly squeezed orange juice straight from the trees.",
    duration: "2 - 3 Hours",
    bestTime: "October – January",
    image: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
    highlights: ["Direct Orchard Harvesting", "Fresh Organic Juice Tasting", "Scenic Sittong Valley Drive", "Village Photo Ops"],
    featured: true,
  },
  {
    id: "exp-3",
    title: "Ahaldhara Stargazing & Bonfire Night",
    slug: "ahaldhara-stargazing-bonfire",
    shortDesc: "Gather round warm wood fires as evening acoustic tunes echo under crisp Himalayan starry skies.",
    fullDesc: "As night falls over Latpanchar, enjoy a private bonfire set up on our lawn or Ahaldhara ridge. Sip hot authentic Bengali spiced tea or cocoa, relish local barbecued delicacies, and gaze at unpolluted starry constellations.",
    duration: "Evening Activity",
    bestTime: "7:00 PM – 10:00 PM",
    image: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    highlights: ["Wood-Fired Bonfire", "Barbecue & Local Delicacies", "Stargazing Telescope Setup", "Traditional Acoustic Music"],
    featured: true,
  },
  {
    id: "exp-4",
    title: "Cinchona Heritage & Photography Trail",
    slug: "cinchona-heritage-photography-trail",
    shortDesc: "Explore 150-year-old British colonial Cinchona plantations and Latkothi heritage bungalow.",
    fullDesc: "Latpanchar was developed during British rule for Cinchona cultivation (source of Quinine). Walk through old processing trails, misty pine avenues, and majestic viewpoints ideal for landscape photography.",
    duration: "2 Hours",
    bestTime: "Morning or Late Afternoon",
    image: "/images/hero/bengal-latpanchar.jpg.jpeg",
    highlights: ["Latkothi Heritage Villa", "Colonial History Stories", "Pine Forest Mist Trails", "Panoramic Ridge Views"],
    featured: true,
  },
];

// -------------------------------------------------------------
// NEARBY ATTRACTIONS
// -------------------------------------------------------------
export const ATTRACTIONS: AttractionData[] = [
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
    coordinates: { lat: 26.918, lng: 88.420 },
  },
  {
    id: "attr-5",
    name: "Mahananda Wildlife Sanctuary",
    distance: "0 km (Adjacent)",
    driveTime: "0 mins",
    description: "Located right at the edge of the sanctuary's upper core area, rich in Asian elephants, leopards, and over 240 bird species.",
    image: "/images/hero/mahananda-wildlife-sanctuary-siliguri2-attr-hero.jpe",
    coordinates: { lat: 26.910, lng: 88.425 },
  },
];

// -------------------------------------------------------------
// MASONRY GALLERY DATASET
// -------------------------------------------------------------
export const GALLERY_ITEMS: GalleryData[] = [
  {
    id: "gal-1",
    title: "Kanchenjunga Golden Sunrise",
    category: "Sunrise",
    imageUrl: "/images/hero/bengal-latpanchar.jpg.jpeg",
    altText: "Golden sunrise illuminating Kanchenjunga peak from Latpanchar",
  },
  {
    id: "gal-2",
    title: "Rufous-necked Hornbill Pair",
    category: "Birding",
    imageUrl: "/images/hero/bengal-latpanchar-rufous-necked-hornbill-pair-parag-gurung-1_egnyvn-1024x744.jpg.jpeg",
    altText: "Pair of Rufous-necked Hornbills perched on branch",
  },
  {
    id: "gal-3",
    title: "Colonial Suite Veranda",
    category: "Rooms",
    imageUrl: "/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg",
    altText: "Luxury bedroom interior with mountain view veranda",
  },
  {
    id: "gal-4",
    title: "Cosy Evening Bonfire",
    category: "Events",
    imageUrl: "/images/hero/ChatGPT Image Aug 4, 2026, 11_29_35 PM.png",
    altText: "Guest bonfire night at Lotus Paradise Homestay lawn",
  },
  {
    id: "gal-5",
    title: "Fresh Himalayan Orange Harvest",
    category: "Nature",
    imageUrl: "/images/hero/latpanchar-dawaipani-tour-packages.jpg",
    altText: "Orange trees laden with ripe fruit in Sittong",
  },
  {
    id: "gal-6",
    title: "Authentic Bengali Cuisine Feast",
    category: "Food",
    imageUrl: "/images/hero/13.jpg.jpeg",
    altText: "Traditional homestay dining setup with authentic delicacies",
  },
  {
    id: "gal-7",
    title: "Mahananda Sanctuary Forest Canopy",
    category: "Nature",
    imageUrl: "/images/hero/mahananda-wildlife-sanctuary-siliguri2-attr-hero.jpe",
    altText: "Dense green forest canopy in upper Latpanchar",
  },
  {
    id: "gal-8",
    title: "Rare Himalayan Songbird",
    category: "Birding",
    imageUrl: "/images/hero/images (1).jpe",
    altText: "Songbird perched in mossy branches",
  },
];

// -------------------------------------------------------------
// TESTIMONIALS
// -------------------------------------------------------------
export const TESTIMONIALS: TestimonialData[] = [
  {
    id: "test-1",
    guestName: "Anirban & Swati Roy",
    location: "Kolkata, West Bengal",
    rating: 5,
    date: "November 2025",
    comment: "Lotus Paradise exceeded all expectations! The view of Kanchenjunga right from our bed at sunrise was magical. The home-cooked Bengali thali, fresh fish, and warm hospitality made us feel like family.",
    avatar: "/images/hero/images (2).jpe",
  },
  {
    id: "test-2",
    guestName: "Dr. Richard & Sarah Miller",
    location: "London, UK",
    rating: 5,
    date: "March 2025",
    comment: "As avid birdwatchers, Latpanchar was on our bucket list for years. The homestay's naturalist helped us spot the Rufous-necked Hornbill within 2 hours of arrival! Immaculate cleanliness, hot bed warmers, and stunning tea.",
    avatar: "/images/hero/images (3).jpe",
  },
  {
    id: "test-3",
    guestName: "Vikram & Neha Sharma",
    location: "Bengaluru, India",
    rating: 5,
    date: "December 2025",
    comment: "We hosted our corporate leadership retreat here. The bonfire evenings, drone views, quiet atmosphere, and seamless WiFi allowed us to bond deeply away from noisy city boardrooms.",
    avatar: "/images/hero/images (1).jpe",
  },
];

// -------------------------------------------------------------
// FAQ ACCORDION DATASET
// -------------------------------------------------------------
export const FAQS: FAQItem[] = [
  {
    question: "How do I reach Lotus Paradise Homestay in Latpanchar?",
    answer: "Latpanchar is located approximately 42 km from NJP Railway Station and 48 km from Bagdogra Airport (IXB). We can arrange private luxury pickup cabs (Innova / Xylo) directly to our doorstep.",
    category: "Location & Travel",
  },
  {
    question: "What is the best time to visit for Kanchenjunga views and Birdwatching?",
    answer: "For crystal-clear Kanchenjunga peaks, October to January is ideal. For rare Rufous-necked Hornbill nesting and vibrant forest blooms, March to May is magnificent.",
    category: "Best Season",
  },
  {
    question: "Are all meals included in the stay package?",
    answer: "Gourmet home-cooked breakfast is complimentary with all room bookings. We also serve authentic organic Bengali lunches, evening snacks with tea/coffee, and warm dinner thalis prepared fresh upon request.",
    category: "Dining & Food",
  },
  {
    question: "Is high-speed internet/WiFi available for remote work?",
    answer: "Yes! We provide optical fiber high-speed WiFi across all rooms, common verandas, and dining areas, making Lotus Paradise ideal for workcations and corporate retreats.",
    category: "Amenities",
  },
  {
    question: "How do we arrange guided birdwatching & local sightseeing?",
    answer: "Our team includes certified local naturalists and experienced drivers. You can book custom birdwatching walks, Sittong orange farm tours, and Ahaldhara sunrise trips directly at our desk.",
    category: "Activities",
  },
];

// -------------------------------------------------------------
// BLOG ARTICLES
// -------------------------------------------------------------
export const BLOG_POSTS: BlogArticle[] = [
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
