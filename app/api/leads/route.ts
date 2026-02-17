import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { sendLineMessage } from "@/lib/line-messaging";
import { sendEmail, generateLeadEmailHTML } from "@/lib/email";

// Public: create a new lead (booking/visit request)
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    name,
    phone,
    lineId,
    visitDate,
    message,
    villaId,
  } = body as {
    name?: unknown;
    phone?: unknown;
    lineId?: unknown;
    visitDate?: unknown;
    message?: unknown;
    villaId?: unknown;
  };

  const nameStr = typeof name === "string" ? name.trim() : String(name ?? "").trim();
  const phoneStr = typeof phone === "string" ? phone.trim() : String(phone ?? "").trim();

  if (!nameStr || !phoneStr) {
    return NextResponse.json(
      { error: "Name and telephone are required." },
      { status: 400 }
    );
  }

  let visitDateValue: Date | null = null;
  if (typeof visitDate === "string" && visitDate.trim()) {
    const d = new Date(visitDate);
    if (!Number.isNaN(d.getTime())) {
      visitDateValue = d;
    }
  }

  // Resolve villa name if villaId provided
  let villaName: string | null = null;
  const villaIdStr = villaId ? String(villaId).trim() || null : null;
  if (villaIdStr) {
    const v = await prisma.villa.findUnique({
      where: { id: villaIdStr },
      select: { name: true },
    });
    villaName = v?.name ?? null;
  }

  // FIRST: Save lead to database - this MUST succeed
  let lead;
  try {
    lead = await prisma.lead.create({
      data: {
        name: nameStr,
        phone: phoneStr, // Use phone field - confirmed in database
        lineId: lineId ? String(lineId).trim() || null : null,
        message: message ? String(message).trim() || null : null,
        villaId: villaIdStr,
        visitDate: visitDateValue,
      },
    });
    console.log('Lead saved to database:', lead.id);
  } catch (dbError) {
    console.error('Failed to save lead to database:', dbError);
    return NextResponse.json(
      { error: "Failed to save lead. Please try again." },
      { status: 500 }
    );
  }

  // SECOND: Send notifications (fire-and-forget, errors should NOT affect the response)
  const adminEmail = process.env.ADMIN_EMAIL;
  
  // Send email notification
  try {
    const emailHTML = generateLeadEmailHTML({
      name: nameStr,
      phone: phoneStr,
      lineId: lineId ? String(lineId).trim() : undefined,
      message: message ? String(message).trim() : undefined,
      villaName: villaName || undefined,
      visitDate: visitDateValue || undefined,
    });

    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `🏡 New Lead: ${nameStr} - Bann Mae Villa`,
        html: emailHTML,
      }).catch((error) => {
        console.error('Failed to send lead email:', error);
      });
    } else {
      console.warn('ADMIN_EMAIL not configured in .env file');
    }
  } catch (emailError) {
    console.error('Email notification error:', emailError);
  }

  // Send LINE notification - wrapped in try-catch to prevent any failures
  try {
    const lineMsg = [
      `\n🏡 ลูกค้าใหม่สนใจ!`,
      `👤 ชื่อ: ${nameStr}`,
      `📞 เบอร์: ${phoneStr}`,
      lineId ? `💬 LINE: ${String(lineId).trim()}` : null,
      villaName ? `🏠 สนใจ: ${villaName}` : null,
      visitDateValue ? `📅 วันเยี่ยมชม: ${visitDateValue.toLocaleDateString("th-TH")}` : null,
      message ? `💬 ข้อความ: ${String(message).trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await sendLineMessage(lineMsg);
    console.log('LINE notification sent successfully');
  } catch (lineError) {
    console.error('LINE notification failed:', lineError);
    // IMPORTANT: Do NOT re-throw - lead is already saved to database
  }

  // Check if email was configured and working
  let responseMessage = "Lead saved successfully";
  if (!adminEmail) {
    responseMessage = "Lead saved (email not configured)";
  }

  return NextResponse.json({ 
    ...lead, 
    message: responseMessage 
  }, { status: 201 });
}

// Admin: list all leads (latest first)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    include: {
      villa: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(leads);
}

