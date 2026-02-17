import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  const villas = await prisma.villa.findMany({
    where:
      q === ""
        ? undefined
        : {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { location: { contains: q, mode: "insensitive" } },
            ],
          },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(villas);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const {
      name,
      slug,
      location,
      price,
      discountPrice,
      bedrooms,
      bathrooms,
      areaSqM,
      areaSqWah,
      type,
      plotNumber,
      status,
      description,
      images,
      facilities,
    } = body;

    // Basic validation
    if (!name || !slug || !location || price == null || bedrooms == null || bathrooms == null) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, location, price, bedrooms, bathrooms" },
        { status: 400 }
      );
    }

    const villa = await prisma.villa.create({
      data: {
        name: String(name),
        slug: String(slug).replace(/\s+/g, "-").toLowerCase(),
        location: String(location),
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        areaSqM: areaSqM ? Number(areaSqM) : null,
        areaSqWah: areaSqWah ? Number(areaSqWah) : null,
        type: type ? String(type) : null,
        plotNumber: plotNumber ? String(plotNumber) : null,
        status: String(status),
        description: description ? String(description) : null,
        images: Array.isArray(images) ? images : [],
        facilities: Array.isArray(facilities) ? facilities : [],
      },
    });

    return NextResponse.json(villa);
  } catch (error) {
    console.error("Error creating villa:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
