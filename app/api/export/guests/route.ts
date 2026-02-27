import { auth } from "@clerk/nextjs/server";
import { getGuestRegistrations } from "@/lib/actions/registrations";
import { registrationsToCSV } from "@/lib/utils";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;

  const guests = await getGuestRegistrations(q);

  const rows = guests.map((g) => ({
    id: g.id,
    fullName: g.fullName,
    nationality: g.nationality,
    passportNumber: g.passportNumber,
    passportExpiry: g.passportExpiry,
    dateOfBirth: g.dateOfBirth,
    gender: g.gender,
    phone: g.phone,
    email: g.email ?? "",
    arrivalDate: g.arrivalDate,
    departureDate: g.departureDate,
    roomNumber: g.roomNumber ?? "",
    property: g.property.name,
    city: g.property.city ?? "",
    submittedAt: g.submittedAt,
  }));

  const csv = registrationsToCSV(rows);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="checkitun-guests-${Date.now()}.csv"`,
    },
  });
}
