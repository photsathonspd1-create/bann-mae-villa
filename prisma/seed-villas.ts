import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

// Load .env file
config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Price list data from AROWANYX_Price_List_V4
const villaData = [
  {
    plotNumber: 'A3',
    name: 'Villa A3',
    slug: 'villa-a3',
    type: 'Type A',
    status: 'SOLD',
    price: 4500000, // 4.5M THB (example price)
    areaSqM: 504, // 126 sq wah
    areaSqWah: 126,
    usableAreaSqM: 350,
    bedrooms: 3,
    bathrooms: 3,
    location: 'Pattaya, Thailand',
    description: 'Modern Type A villa with 3 bedrooms and premium finishes',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf161d?w=800&q=80&auto=format&fit=crop'
    ],
    nameTh: 'วิลล่า A3',
    nameEn: 'Villa A3',
    nameCn: 'A3别墅',
    descriptionTh: 'วิลล่าทันสมัย Type A 3 ห้องนอนพร้อมวัสดุคุณภาพพรีเมียม',
    descriptionEn: 'Modern Type A villa with 3 bedrooms and premium finishes',
    descriptionCn: '现代A型别墅，3间卧室，优质装修',
    locationEn: 'Pattaya, Thailand',
    locationCn: '芭提雅，泰国',
    facilities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Gym'],
  },
  {
    plotNumber: 'A4',
    name: 'Villa A4',
    slug: 'villa-a4',
    type: 'Type A',
    status: 'AVAILABLE',
    price: 4500000, // 4.5M THB
    areaSqM: 504, // 126 sq wah
    areaSqWah: 126,
    usableAreaSqM: 350,
    bedrooms: 3,
    bathrooms: 3,
    location: 'Pattaya, Thailand',
    description: 'Modern Type A villa with 3 bedrooms and premium finishes',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf161d?w=800&q=80&auto=format&fit=crop'
    ],
    nameTh: 'วิลล่า A4',
    nameEn: 'Villa A4',
    nameCn: 'A4别墅',
    descriptionTh: 'วิลล่าทันสมัย Type A 3 ห้องนอนพร้อมวัสดุคุณภาพพรีเมียม',
    descriptionEn: 'Modern Type A villa with 3 bedrooms and premium finishes',
    descriptionCn: '现代A型别墅，3间卧室，优质装修',
    locationEn: 'Pattaya, Thailand',
    locationCn: '芭提雅，泰国',
    facilities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Gym'],
  },
  {
    plotNumber: 'B5',
    name: 'Villa B5',
    slug: 'villa-b5',
    type: 'Type B',
    status: 'AVAILABLE',
    price: 5500000, // 5.5M THB (higher price for Type B)
    areaSqM: 630, // 157.5 sq wah
    areaSqWah: 157.5,
    usableAreaSqM: 420,
    bedrooms: 4,
    bathrooms: 4,
    location: 'Pattaya, Thailand',
    description: 'Spacious Type B villa with 4 bedrooms and luxury amenities',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop'
    ],
    nameTh: 'วิลล่า B5',
    nameEn: 'Villa B5',
    nameCn: 'B5别墅',
    descriptionTh: 'วิลล่ากว้างขวาง Type B 4 ห้องนอนพร้อมสิ่งอำนวยความสะดวกหรูหรา',
    descriptionEn: 'Spacious Type B villa with 4 bedrooms and luxury amenities',
    descriptionCn: '宽敞的B型别墅，4间卧室，豪华设施',
    locationEn: 'Pattaya, Thailand',
    locationCn: '芭提雅，泰国',
    facilities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Gym', 'Home Theater'],
  },
  {
    plotNumber: 'B6',
    name: 'Villa B6',
    slug: 'villa-b6',
    type: 'Type B',
    status: 'AVAILABLE',
    price: 5500000, // 5.5M THB
    areaSqM: 630, // 157.5 sq wah
    areaSqWah: 157.5,
    usableAreaSqM: 420,
    bedrooms: 4,
    bathrooms: 4,
    location: 'Pattaya, Thailand',
    description: 'Spacious Type B villa with 4 bedrooms and luxury amenities',
    images: [
      'https://images.unsplash.com/photo-1600047509319-42699d5bdbc4',
      'https://images.unsplash.com/photo-1600566753376-12c8ac7ecb73',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf161d'
    ],
    nameTh: 'วิลล่า B6',
    nameEn: 'Villa B6',
    nameCn: 'B6别墅',
    descriptionTh: 'วิลล่ากว้างขวาง Type B 4 ห้องนอนพร้อมสิ่งอำนวยความสะดวกหรูหรา',
    descriptionEn: 'Spacious Type B villa with 4 bedrooms and luxury amenities',
    descriptionCn: '宽敞的B型别墅，4间卧室，豪华设施',
    locationEn: 'Pattaya, Thailand',
    locationCn: '芭提雅，泰国',
    facilities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Gym', 'Home Theater'],
  },
  {
    plotNumber: 'B7',
    name: 'Villa B7',
    slug: 'villa-b7',
    type: 'Type B',
    status: 'SOLD',
    price: 5500000, // 5.5M THB
    areaSqM: 630, // 157.5 sq wah
    areaSqWah: 157.5,
    usableAreaSqM: 420,
    bedrooms: 4,
    bathrooms: 4,
    location: 'Pattaya, Thailand',
    description: 'Spacious Type B villa with 4 bedrooms and luxury amenities',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop'
    ],
    nameTh: 'วิลล่า B7',
    nameEn: 'Villa B7',
    nameCn: 'B7别墅',
    descriptionTh: 'วิลล่ากว้างขวาง Type B 4 ห้องนอนพร้อมสิ่งอำนวยความสะดวกหรูหรา',
    descriptionEn: 'Spacious Type B villa with 4 bedrooms and luxury amenities',
    descriptionCn: '宽敞的B型别墅，4间卧室，豪华设施',
    locationEn: 'Pattaya, Thailand',
    locationCn: '芭提雅，泰国',
    facilities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Gym', 'Home Theater'],
  },
  {
    plotNumber: 'B8',
    name: 'Villa B8',
    slug: 'villa-b8',
    type: 'Type B',
    status: 'AVAILABLE',
    price: 5500000, // 5.5M THB
    areaSqM: 630, // 157.5 sq wah
    areaSqWah: 157.5,
    usableAreaSqM: 420,
    bedrooms: 4,
    bathrooms: 4,
    location: 'Pattaya, Thailand',
    description: 'Spacious Type B villa with 4 bedrooms and luxury amenities',
    images: [
      'https://images.unsplash.com/photo-1600047509319-42699d5bdbc4',
      'https://images.unsplash.com/photo-1600566753376-12c8ac7ecb73',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf161d'
    ],
    nameTh: 'วิลล่า B8',
    nameEn: 'Villa B8',
    nameCn: 'B8别墅',
    descriptionTh: 'วิลล่ากว้างขวาง Type B 4 ห้องนอนพร้อมสิ่งอำนวยความสะดวกหรูหรา',
    descriptionEn: 'Spacious Type B villa with 4 bedrooms and luxury amenities',
    descriptionCn: '宽敞的B型别墅，4间卧室，豪华设施',
    locationEn: 'Pattaya, Thailand',
    locationCn: '芭提雅，泰国',
    facilities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Gym', 'Home Theater'],
  },
];

async function seedVillas() {
  console.log('🏠 Seeding villas with price list data...');
  
  // Clear existing villas
  await prisma.villa.deleteMany();
  console.log('✅ Cleared existing villas');
  
  // Create villas
  for (const villa of villaData) {
    await prisma.villa.create({
      data: villa,
    });
    console.log(`✅ Created ${villa.name} (${villa.plotNumber}) - Status: ${villa.status}`);
  }
  
  console.log('🎉 Villa seeding completed!');
}

async function main() {
  try {
    await seedVillas();
  } catch (error) {
    console.error('❌ Error seeding villas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
