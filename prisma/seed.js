const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Lotus Paradise Homestay database...");

  // Seed Admin User
  await prisma.user.upsert({
    where: { email: "admin@lotusparadise.com" },
    update: {},
    create: {
      name: "Lotus Paradise Admin",
      email: "admin@lotusparadise.com",
      password: "luxury2026passwordhash",
      role: "ADMIN",
    },
  });

  // Seed Rooms
  const roomsData = [
    {
      title: "Kanchenjunga Grand Deluxe Suite",
      slug: "kanchenjunga-grand-deluxe-suite",
      type: "Deluxe Suite",
      pricePerNight: 4800,
      capacity: 3,
      bedType: "King Bed + Daybed",
      view: "Panoramic Kanchenjunga & Forest View",
      description: "Our signature luxury suite features a private teak wood balcony overlooking the snow-capped Himalayan ranges, bespoke hand-carved furnishings, electric blanket warming, and attached marble bathroom with instant geyser.",
      amenities: JSON.stringify(["Kanchenjunga Balcony", "Breakfast Included", "High-Speed WiFi", "Electric Bed Warmer", "Geyser", "Room Service"]),
      images: JSON.stringify(["/images/hero/b.jpg.jpg.jpeg", "/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg"]),
      featured: true,
      available: true,
    },
    {
      title: "Heritage Family Duplex Suite",
      slug: "heritage-family-duplex-suite",
      type: "Family Suite",
      pricePerNight: 6500,
      capacity: 5,
      bedType: "2 Queen Beds + Lounge",
      view: "Pine Forest & Garden View",
      description: "Designed for families and groups seeking spacious comfort. Features two separate bedroom spaces, traditional wooden paneling, private seating lounge, and garden access.",
      amenities: JSON.stringify(["Two Queen Beds", "Garden Access Veranda", "Breakfast Included", "Free High-Speed WiFi", "Geyser", "Electric Kettles"]),
      images: JSON.stringify(["/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg", "/images/hero/13.jpg.jpeg"]),
      featured: true,
      available: true,
    },
    {
      title: "Colonial Couple Retreat",
      slug: "colonial-couple-retreat",
      type: "Couple Room",
      pricePerNight: 3900,
      capacity: 2,
      bedType: "Queen Canopy Bed",
      view: "Mist Forest & Sunrise View",
      description: "An intimate, romantic haven designed with warm ivory tones, colonial lamps, plush bedding, and floor-to-ceiling glass windows framing morning Himalayan mist.",
      amenities: JSON.stringify(["Canopy Queen Bed", "Private Sunrise Deck", "Breakfast Included", "Free WiFi", "Electric Kettle"]),
      images: JSON.stringify(["/images/hero/13.jpg.jpeg"]),
      featured: true,
      available: true,
    },
  ];

  for (const r of roomsData) {
    await prisma.room.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
  }

  // Seed Sample Booking
  const existingRoom = await prisma.room.findFirst();
  if (existingRoom) {
    await prisma.booking.upsert({
      where: { bookingNumber: "LPH-849201" },
      update: {},
      create: {
        bookingNumber: "LPH-849201",
        guestName: "Anirban Roy",
        guestEmail: "anirban.roy@example.com",
        guestPhone: "+91 98300 12345",
        roomId: existingRoom.id,
        checkIn: new Date("2026-08-15"),
        checkOut: new Date("2026-08-18"),
        guestsCount: 2,
        totalAmount: 14400,
        specialRequests: "High floor balcony with Kanchenjunga view & airport pickup.",
        status: "CONFIRMED",
        paymentStatus: "PAID",
      },
    });
  }

  // Seed Corporate Leads
  await prisma.corporateLead.createMany({
    data: [
      {
        company: "TechNova Analytics",
        contactPerson: "Rahul Sengupta",
        email: "rahul@technova.io",
        phone: "+91 98765 43210",
        employeesCount: 16,
        preferredDates: "Oct 12 - Oct 15, 2026",
        budgetRange: "₹2.5L - ₹3L",
        requirements: "Strategy offsite, bonfire night, guided birding hike, audio-visual conference setup.",
        status: "NEW",
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
