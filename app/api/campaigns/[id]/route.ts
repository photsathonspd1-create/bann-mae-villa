import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Public: get campaign by slug (used for dynamic route)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const campaign = await prisma.campaign.findUnique({
    where: { slug: id },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  if (!campaign.isActive) {
    return NextResponse.json({ error: "Campaign not active" }, { status: 404 });
  }

  return NextResponse.json(campaign);
}

// Admin: update campaign
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, slug, content, bannerImage, isActive } = body;

  // Check if campaign exists
  const existingCampaign = await prisma.campaign.findUnique({
    where: { id },
  });

  if (!existingCampaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  // If slug is being changed, check if new slug already exists
  if (slug && slug !== existingCampaign.slug) {
    const slugExists = await prisma.campaign.findUnique({
      where: { slug: slug.trim() },
    });

    if (slugExists) {
      return NextResponse.json(
        { error: "A campaign with this slug already exists" },
        { status: 409 }
      );
    }
  }

  const updateData: any = {};
  if (title !== undefined) updateData.title = title.trim();
  if (slug !== undefined) updateData.slug = slug.trim();
  if (content !== undefined) updateData.content = content.trim();
  if (bannerImage !== undefined) updateData.bannerImage = bannerImage.trim();
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update campaign" },
      { status: 500 }
    );
  }
}

// Admin: delete campaign
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Check if campaign exists
  const existingCampaign = await prisma.campaign.findUnique({
    where: { id },
  });

  if (!existingCampaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  try {
    await prisma.campaign.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
