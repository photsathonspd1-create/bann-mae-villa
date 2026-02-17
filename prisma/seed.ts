import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { config } from "dotenv";

// Load .env file
config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create default admin user
  const email = "test@baanmae.com";
  const password = "123456";
  const hashedPassword = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", email);
  console.log("Login credentials:");
  console.log("Email:", email);
  console.log("Password:", password);

  // Clear existing villas first
  await prisma.villa.deleteMany({});
  console.log("Cleared existing villas");

  // Image URLs for different villa types - Guaranteed working stable URLs
  const poolVillaImage = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop';
  const modernVillaImage = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop';
  const interiorImage = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&auto=format&fit=crop';

  // Create 6 sample villas
  const sampleVillas = [
    // ── Type A – Pool Villa (3 villas, 15-18 MB) ──
    {
      name: "Type A - Tropical Pool Villa Jomtien",
      slug: "type-a-tropical-pool-jomtien",
      location: "Jomtien Beach, Pattaya",
      price: 15900000, // 15.9 MB
      discountPrice: 13900000, // 13.9 MB  ← Sale badge
      bedrooms: 3,
      bathrooms: 2,
      areaSqM: 320,
      areaSqWah: 80,
      type: "Type A",
      plotNumber: "A-01",
      status: "AVAILABLE",
      description: "Beautiful tropical pool villa with private garden and modern amenities",
      images: [poolVillaImage, interiorImage, poolVillaImage],
      facilities: ["pool", "parking", "garden", "near_beach"],
      latitude: 12.8797,
      longitude: 100.8878,
    },
    {
      name: "Type A - Luxury Pool Villa Pratamnak",
      slug: "type-a-luxury-pool-pratamnak",
      location: "Pratamnak Hill, Pattaya",
      price: 18000000, // 18 MB
      bedrooms: 4,
      bathrooms: 3,
      areaSqM: 380,
      areaSqWah: 95,
      type: "Type A",
      plotNumber: "A-02",
      status: "AVAILABLE",
      description: "Luxury pool villa with stunning hill views and premium finishes",
      images: [poolVillaImage, interiorImage, poolVillaImage],
      facilities: ["pool", "parking", "gym", "security"],
      latitude: 12.9345,
      longitude: 100.8765,
    },
    {
      name: "Type A - Garden Pool Villa Na Jomtien",
      slug: "type-a-garden-pool-na-jomtien",
      location: "Na Jomtien, Pattaya",
      price: 16500000, // 16.5 MB
      bedrooms: 3,
      bathrooms: 3,
      areaSqM: 350,
      areaSqWah: 87.5,
      type: "Type A",
      plotNumber: "A-03",
      status: "RESERVED",
      description: "Serene garden pool villa surrounded by tropical landscaping",
      images: [poolVillaImage, interiorImage, poolVillaImage],
      facilities: ["pool", "parking", "garden", "playground"],
      latitude: 12.8234,
      longitude: 100.9123,
    },
    // ── Type B – Modern (3 villas, 12-14 MB) ──
    {
      name: "Type B - Modern Villa Wong Amat",
      slug: "type-b-modern-wong-amat",
      location: "Wong Amat Beach, Pattaya",
      price: 14000000, // 14 MB
      discountPrice: 12500000, // 12.5 MB  ← Sale badge
      bedrooms: 3,
      bathrooms: 3,
      areaSqM: 280,
      areaSqWah: 70,
      type: "Type B",
      plotNumber: "B-01",
      status: "AVAILABLE",
      description: "Sleek modern villa with open-plan living and smart home features",
      images: [modernVillaImage, interiorImage, modernVillaImage],
      facilities: ["parking", "security", "smart_home"],
      latitude: 12.9523,
      longitude: 100.8721,
    },
    {
      name: "Type B - Modern Villa Cosy Beach",
      slug: "type-b-modern-cosy-beach",
      location: "Cosy Beach, Pattaya",
      price: 13500000, // 13.5 MB
      bedrooms: 3,
      bathrooms: 2,
      areaSqM: 260,
      areaSqWah: 65,
      type: "Type B",
      plotNumber: "B-02",
      status: "AVAILABLE",
      description: "Contemporary villa with panoramic city and sea views",
      images: [modernVillaImage, interiorImage, modernVillaImage],
      facilities: ["parking", "security", "gym"],
      latitude: 12.9123,
      longitude: 100.8890,
    },
    {
      name: "Type B - Modern Villa Naklua",
      slug: "type-b-modern-naklua",
      location: "Naklua Bay, Pattaya",
      price: 12000000, // 12 MB
      bedrooms: 2,
      bathrooms: 2,
      areaSqM: 240,
      areaSqWah: 60,
      type: "Type B",
      plotNumber: "B-03",
      status: "SOLD",
      description: "Compact modern villa in quiet Naklua area with clean-line architecture",
      images: [modernVillaImage, interiorImage, modernVillaImage],
      facilities: ["parking", "security", "near_beach"],
      latitude: 12.9678,
      longitude: 100.8654,
    },
  ];

  // Insert all villas
  for (const villa of sampleVillas) {
    await prisma.villa.create({
      data: villa,
    });
  }

  console.log(`Seeded ${sampleVillas.length} villas successfully`);
  console.log("Villa Breakdown:");
  console.log("- Type A (Pool Villa): 3 villas (15-18 MB)");
  console.log("- Type B (Modern): 3 villas (12-14 MB)");
  console.log("- With Discounts: 2 villas (Sale badge)");
  console.log("- Status: 4 Available, 1 Reserved, 1 Sold");

  // Update villas with random view counts
  const villas = await prisma.villa.findMany();
  for (const villa of villas) {
    const viewCount = Math.floor(Math.random() * 450) + 50; // 50-500 views
    await prisma.villa.update({
      where: { id: villa.id },
      data: { views: viewCount }
    });
  }
  console.log("Updated villa view counts (50-500 views each)");

  // Create dummy bookings (simplified to avoid schema conflicts)
  const bookingData = [
    {
      customerName: "John Smith",
      phone: "0812345678",
      status: "CONFIRMED" as const,
      totalAmount: 15000000,
      bookingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
    {
      customerName: "Sarah Johnson",
      phone: "0823456789",
      status: "PENDING" as const,
      totalAmount: 18500000,
      bookingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      customerName: "Michael Chen",
      phone: "0834567890",
      status: "CONFIRMED" as const,
      totalAmount: 22000000,
      bookingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days in future
    },
    {
      customerName: "Emma Wilson",
      phone: "0845678901",
      status: "CANCELLED" as const,
      totalAmount: 13000000,
      bookingDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    },
    {
      customerName: "David Lee",
      phone: "0856789012",
      status: "CONFIRMED" as const,
      totalAmount: 17500000,
      bookingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days in future
    },
    {
      customerName: "Lisa Anderson",
      phone: "0867890123",
      status: "PENDING" as const,
      totalAmount: 24500000,
      bookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      customerName: "Robert Taylor",
      phone: "0878901234",
      status: "CONFIRMED" as const,
      totalAmount: 16800000,
      bookingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in future
    },
  ];

  for (const booking of bookingData) {
    const randomVilla = villas[Math.floor(Math.random() * villas.length)];
    await prisma.booking.create({
      data: {
        customerName: booking.customerName,
        phone: booking.phone,
        status: booking.status,
        totalAmount: booking.totalAmount,
        bookingDate: booking.bookingDate,
        villaId: randomVilla.id,
      }
    });
  }
  console.log(`Created ${bookingData.length} bookings with mixed statuses and dates`);

  // Create dummy leads (simplified)
  const leadData = [
    {
      name: "Amanda Martinez",
      email: "amanda.martinez@email.com",
      phone: "0890123456",
      message: "I'm interested in the Type A villas. Can you provide more information about available properties?",
      status: "NEW" as const,
    },
    {
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "0901234567",
      message: "Looking for a modern villa with sea view. Do you have any properties near Wong Amat beach?",
      status: "CONTACTED" as const,
    },
    {
      name: "Sophie Turner",
      email: "sophie.turner@email.com",
      phone: "0912345678",
      message: "What are the financing options available for the Type B villas?",
      status: "NEW" as const,
    },
    {
      name: "Daniel Kim",
      email: "daniel.kim@email.com",
      phone: "0923456789",
      message: "I would like to schedule a viewing for this weekend. Please let me know available times.",
      status: "CONTACTED" as const,
    },
    {
      name: "Olivia Davis",
      email: "olivia.davis@email.com",
      phone: "0934567890",
      message: "Are there any special promotions or discounts available for early booking?",
      status: "CLOSED" as const,
    },
  ];

  for (const lead of leadData) {
    const randomVilla = villas[Math.floor(Math.random() * villas.length)];
    await prisma.lead.create({
      data: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        status: lead.status,
        villaId: randomVilla.id,
      }
    });
  }
  console.log(`Created ${leadData.length} customer leads with mixed statuses`);

  // Create search keywords
  const searchQueries = [
    { query: "Pool Villa", count: 15 },
    { query: "Pattaya", count: 23 },
    { query: "Sea View", count: 18 },
    { query: "Modern Villa", count: 12 },
    { query: "Luxury Villa", count: 8 },
    { query: "Type A Villa", count: 6 },
    { query: "Type B Villa", count: 4 },
    { query: "Beachfront", count: 11 },
    { query: "Jomtien", count: 9 },
    { query: "Wong Amat", count: 7 },
  ];

  for (const search of searchQueries) {
    await prisma.searchQuery.upsert({
      where: { query: search.query },
      update: { count: search.count },
      create: {
        query: search.query,
        count: search.count,
        lastSearchedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random within last 30 days
      }
    });
  }
  console.log(`Created/updated ${searchQueries.length} search keywords`);

  console.log("\n🎉 Database seeding completed with realistic activity data!");
  console.log("📊 Dashboard Activity Summary:");
  console.log(`   - Villa Views: ${villas.length} villas with 50-500 views each`);
  console.log(`   - Bookings: ${bookingData.length} bookings (${bookingData.filter(b => b.status === 'CONFIRMED').length} confirmed, ${bookingData.filter(b => b.status === 'PENDING').length} pending, ${bookingData.filter(b => b.status === 'CANCELLED').length} cancelled)`);
  console.log(`   - Leads: ${leadData.length} customer inquiries (${leadData.filter(l => l.status === 'NEW').length} new, ${leadData.filter(l => l.status === 'CONTACTED').length} contacted, ${leadData.filter(l => l.status === 'CLOSED').length} closed)`);
  console.log(`   - Search Terms: ${searchQueries.length} popular keywords`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
