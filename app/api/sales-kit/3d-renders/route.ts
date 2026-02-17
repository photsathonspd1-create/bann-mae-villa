import { NextResponse } from "next/server";

export async function GET() {
  // In a real implementation, this would serve a ZIP file containing all 3D renders
  // For now, we'll return a placeholder ZIP file
  
  // This would be the actual ZIP file containing high-resolution 3D renders
  const zipContent = Buffer.from('PK\x03\x04\x14\x00\x00\x00\x08\x00', 'binary');
  
  return new NextResponse(zipContent, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="baan-mae-villa-3d-renders.zip"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
