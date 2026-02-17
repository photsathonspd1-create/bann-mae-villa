import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    console.log("Test API called");
    
    // Test basic database connection
    const count = await prisma.villa.count();
    console.log("Villa count:", count);
    
    // Test creating a simple villa with all required fields
    const villa = await prisma.villa.create({
      data: {
        name: "Test Villa",
        slug: "test-villa",
        location: "Test Location",
        price: 1000000,
        bedrooms: 3,
        bathrooms: 2,
        status: "AVAILABLE",
        description: "Test description",
        images: [],
        facilities: [],
      },
    });
    
    console.log("Test villa created:", villa);
    
    return NextResponse.json({ success: true, villa });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { error: "Test failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
