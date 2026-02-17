import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let leads;
  try {
    leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { villa: { select: { name: true } } },
    });
    console.log(`Found ${leads.length} leads to export`);
  } catch (error) {
    console.error('Failed to fetch leads for export:', error);
    return NextResponse.json(
      { error: "Failed to fetch leads data" },
      { status: 500 }
    );
  }

  // CSV header
  const headers = ["Name", "Phone", "LINE ID", "Villa", "Visit Date", "Message", "Status", "Created"];

  // Build rows with robust null handling
  const rows = leads.map((lead) => {
    try {
      return [
        escapeCsv(lead.name || "Unknown"),
        escapeCsv((lead as any).phone || lead.tel || ""), // Handle both field names
        escapeCsv(lead.lineId || ""),
        escapeCsv(lead.villa?.name || "No villa"),
        lead.visitDate ? new Date(lead.visitDate).toLocaleDateString("th-TH") : "Not set",
        escapeCsv(lead.message || "No message"),
        escapeCsv(lead.status || "Unknown"),
        lead.createdAt ? new Date(lead.createdAt).toLocaleString("th-TH") : "Unknown date",
      ];
    } catch (rowError) {
      console.error('Error processing lead row:', lead.id, rowError);
      return [
        "Error",
        "Error",
        "Error", 
        "Error",
        "Error",
        "Error",
        "Error",
        "Error"
      ];
    }
  });

  // UTF-8 BOM for Excel Thai support
  const BOM = "\uFEFF";
  const csv = BOM + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const today = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${today}.csv"`,
    },
  });
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
