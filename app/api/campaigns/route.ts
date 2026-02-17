import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Public: get all active campaigns
export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(campaigns);
}

// Admin: create new campaign
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, content, bannerImage, isActive = true } = body;

  // Validate required fields
  if (!title?.trim() || !slug?.trim() || !content?.trim() || !bannerImage?.trim()) {
    return NextResponse.json(
      { error: "Title, slug, content, and banner image are required" },
      { status: 400 }
    );
  }

  // Check if slug already exists
  const existingCampaign = await prisma.campaign.findUnique({
    where: { slug: slug.trim() },
  });

  if (existingCampaign) {
    return NextResponse.json(
      { error: "A campaign with this slug already exists" },
      { status: 409 }
    );
  }

  try {
    const campaign = await prisma.campaign.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        bannerImage: bannerImage.trim(),
        isActive: Boolean(isActive),
      },
    });
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create campaign" },
      { status: 500 }
    );
  }
}
