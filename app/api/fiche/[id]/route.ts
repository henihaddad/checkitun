import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, guestRegistrations, properties } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { buildFichePdf } from "@/lib/pdf/fiche";

export const runtime = "nodejs";
export const maxDuration = 20;

function slug(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 40);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const reg = await db.query.guestRegistrations.findFirst({
    where: eq(guestRegistrations.id, id),
    with: { property: true },
  });
  if (!reg) return new NextResponse("Not found", { status: 404 });

  // Ownership check
  const owns = await db.query.properties.findFirst({
    where: and(eq(properties.id, reg.propertyId), eq(properties.userId, userId)),
    columns: { id: true },
  });
  if (!owns) return new NextResponse("Not found", { status: 404 });

  const pdfBytes = await buildFichePdf({
    fullName: reg.fullName,
    nationality: reg.nationality,
    dateOfBirth: reg.dateOfBirth,
    passportNumber: reg.passportNumber,
    passportExpiry: reg.passportExpiry,
    phone: reg.phone,
    email: reg.email,
    arrivalDate: reg.arrivalDate,
    departureDate: reg.departureDate,
    roomNumber: reg.roomNumber,
    propertyName: reg.property.name,
    propertyCity: reg.property.city,
    submittedAt: reg.submittedAt,
    passportPhotoUrl: reg.passportPhotoUrl,
  });

  const filename = `fiche-${slug(reg.fullName)}-${reg.id.slice(0, 8)}.pdf`;
  return new NextResponse(Buffer.from(pdfBytes) as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
