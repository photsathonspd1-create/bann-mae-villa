import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

// Load .env file
config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Working Unsplash URLs
const WORKING_URLS = {
  poolVilla: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop",
  modernVilla: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop",
  interior: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&auto=format&fit=crop",
  fallback: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop",
};

// Broken URL patterns to replace
const BROKEN_PATTERNS = [
  "https://images.unsplash.com/photo-1600566753376-12c8ac7ecb73",
  "https://images.unsplash.com/photo-1600047509319-42699d5bdbc4",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf161d",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
];

async function fixVillaImages() {
  console.log("🔧 Fixing Villa images...");
  
  const villas = await prisma.villa.findMany();
  let updatedCount = 0;

  for (const villa of villas) {
    let needsUpdate = false;
    const updatedImages = [...villa.images];

    // Check and replace broken URLs
    for (let i = 0; i < updatedImages.length; i++) {
      const imageUrl = updatedImages[i];
      
      // Check if this URL contains broken patterns
      if (BROKEN_PATTERNS.some(pattern => imageUrl.includes(pattern))) {
        // Replace with appropriate working URL based on villa type
        if (villa.type?.includes("Type A") || villa.name?.toLowerCase().includes("pool")) {
          updatedImages[i] = WORKING_URLS.poolVilla;
        } else if (villa.type?.includes("Type B") || villa.name?.toLowerCase().includes("modern")) {
          updatedImages[i] = WORKING_URLS.modernVilla;
        } else {
          updatedImages[i] = WORKING_URLS.fallback;
        }
        needsUpdate = true;
        console.log(`  🔄 Updated villa ${villa.name}: ${imageUrl} → ${updatedImages[i]}`);
      }
    }

    // If no images or all broken, set default images
    if (updatedImages.length === 0 || updatedImages.every(img => 
      BROKEN_PATTERNS.some(pattern => img.includes(pattern))
    )) {
      if (villa.type?.includes("Type A") || villa.name?.toLowerCase().includes("pool")) {
        updatedImages.splice(0, updatedImages.length, WORKING_URLS.poolVilla, WORKING_URLS.interior);
      } else {
        updatedImages.splice(0, updatedImages.length, WORKING_URLS.modernVilla, WORKING_URLS.interior);
      }
      needsUpdate = true;
      console.log(`  🔄 Reset villa ${villa.name} images to working URLs`);
    }

    if (needsUpdate) {
      await prisma.villa.update({
        where: { id: villa.id },
        data: { images: updatedImages }
      });
      updatedCount++;
    }
  }

  console.log(`✅ Updated ${updatedCount} villas with working images`);
}

async function fixHeroSlideImages() {
  console.log("🔧 Fixing Hero Slide images...");
  
  const heroSlides = await prisma.heroSlide.findMany();
  let updatedCount = 0;

  for (const slide of heroSlides) {
    let needsUpdate = false;
    let updatedImageUrl = slide.imageUrl;

    // Check if imageUrl contains broken patterns
    if (BROKEN_PATTERNS.some(pattern => updatedImageUrl.includes(pattern))) {
      updatedImageUrl = WORKING_URLS.fallback;
      needsUpdate = true;
      console.log(`  🔄 Updated hero slide ${slide.id}: ${slide.imageUrl} → ${updatedImageUrl}`);
    }

    // If no imageUrl or broken, set fallback
    if (!updatedImageUrl || BROKEN_PATTERNS.some(pattern => updatedImageUrl.includes(pattern))) {
      updatedImageUrl = WORKING_URLS.fallback;
      needsUpdate = true;
      console.log(`  🔄 Set hero slide ${slide.id} to fallback image`);
    }

    if (needsUpdate) {
      await prisma.heroSlide.update({
        where: { id: slide.id },
        data: { imageUrl: updatedImageUrl }
      });
      updatedCount++;
    }
  }

  console.log(`✅ Updated ${updatedCount} hero slides with working images`);
}

async function main() {
  console.log("🚀 Starting broken image fix script...");
  
  try {
    await fixVillaImages();
    await fixHeroSlideImages();
    console.log("🎉 All images fixed successfully!");
  } catch (error) {
    console.error("❌ Error fixing images:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
