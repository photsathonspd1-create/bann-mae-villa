import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/bookings - Get all bookings (admin only) or bookings for specific villa
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const villaId = searchParams.get("villaId");
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is admin
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      // For non-admin users, only allow fetching bookings for specific villa
      if (!villaId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (villaId) {
      // Get bookings for specific villa (public endpoint)
      const bookings = await prisma.booking.findMany({
        where: {
          villaId,
          status: "CONFIRMED",
        },
        orderBy: {
          bookingDate: "asc",
        },
        select: {
          id: true,
          bookingDate: true,
          status: true,
        },
      });
      return NextResponse.json(bookings);
    } else {
      // Get all bookings (admin only)
      const bookings = await prisma.booking.findMany({
        include: {
          villa: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(bookings);
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST /api/bookings - Create new booking (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is admin
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { villaId, customerName, phone, totalAmount, bookingFee, contractFee, installmentAmount, lineId, status = "PENDING" } = body;

    // Validate required fields
    if (!villaId || !customerName || !phone || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields: villaId, customerName, phone, totalAmount" },
        { status: 400 }
      );
    }

    // Verify villa exists
    const villa = await prisma.villa.findUnique({
      where: { id: villaId },
    });

    if (!villa) {
      return NextResponse.json({ error: "Villa not found" }, { status: 404 });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        villaId,
        customerName,
        phone,
        totalAmount: parseFloat(totalAmount),
        bookingFee: bookingFee ? parseFloat(bookingFee) : 200000,
        contractFee: contractFee ? parseFloat(contractFee) : undefined,
        installmentAmount: installmentAmount ? parseFloat(installmentAmount) : undefined,
        lineId,
        status,
        userId: session.user?.id,
      },
      include: {
        villa: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
