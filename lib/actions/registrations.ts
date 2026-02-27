"use server";

import { auth } from "@clerk/nextjs/server";
import { db, guestRegistrations, checkinLinks, properties } from "@/lib/db";
import { eq, and, desc, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const registrationSchema = z.object({
  checkinLinkId: z.string().uuid(),
  propertyId: z.string().uuid(),
  fullName: z.string().min(2).max(120),
  nationality: z.string().min(2).max(80),
  passportNumber: z.string().min(2).max(30),
  passportExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(6).max(20),
  email: z.string().email().optional().or(z.literal("")),
  arrivalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  roomNumber: z.string().max(20).optional().or(z.literal("")),
  passportPhotoUrl: z.string().url().optional().or(z.literal("")),
  passportPhotoKey: z.string().optional().or(z.literal("")),
});

export async function submitRegistration(input: z.infer<typeof registrationSchema>) {
  const parsed = registrationSchema.parse(input);

  // Verify the link is valid and active
  const link = await db.query.checkinLinks.findFirst({
    where: and(
      eq(checkinLinks.id, parsed.checkinLinkId),
      eq(checkinLinks.isActive, true)
    ),
  });

  if (!link) throw new Error("Invalid or expired check-in link");
  if (link.expiresAt && link.expiresAt < new Date()) {
    throw new Error("This check-in link has expired");
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    null;

  const [registration] = await db
    .insert(guestRegistrations)
    .values({
      ...parsed,
      email: parsed.email || null,
      roomNumber: parsed.roomNumber || null,
      passportPhotoUrl: parsed.passportPhotoUrl || null,
      passportPhotoKey: parsed.passportPhotoKey || null,
      ipAddress: ip,
    })
    .returning();

  return registration;
}

export async function getGuestRegistrations(search?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get all property IDs owned by this user
  const userProperties = await db.query.properties.findMany({
    where: eq(properties.userId, userId),
    columns: { id: true },
  });
  const propertyIds = userProperties.map((p) => p.id);
  if (propertyIds.length === 0) return [];

  const results = await db.query.guestRegistrations.findMany({
    where: search
      ? and(
          or(
            ...propertyIds.map((pid) => eq(guestRegistrations.propertyId, pid))
          ),
          or(
            ilike(guestRegistrations.fullName, `%${search}%`),
            ilike(guestRegistrations.passportNumber, `%${search}%`),
            ilike(guestRegistrations.nationality, `%${search}%`)
          )
        )
      : or(...propertyIds.map((pid) => eq(guestRegistrations.propertyId, pid))),
    orderBy: [desc(guestRegistrations.createdAt)],
    with: {
      property: { columns: { name: true, city: true } },
      checkinLink: { columns: { label: true, token: true } },
    },
  });

  return results;
}

export async function getRegistration(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const reg = await db.query.guestRegistrations.findFirst({
    where: eq(guestRegistrations.id, id),
    with: {
      property: true,
      checkinLink: true,
    },
  });

  if (!reg) return null;

  // Verify ownership
  const prop = await db.query.properties.findFirst({
    where: and(
      eq(properties.id, reg.propertyId),
      eq(properties.userId, userId)
    ),
  });

  if (!prop) return null;
  return reg;
}

export async function getDashboardStats() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const userProperties = await db.query.properties.findMany({
    where: eq(properties.userId, userId),
    columns: { id: true },
    with: {
      guestRegistrations: { columns: { id: true, createdAt: true } },
      checkinLinks: { where: (l, { eq }) => eq(l.isActive, true), columns: { id: true } },
    },
  });

  const totalProperties = userProperties.length;
  const totalGuests = userProperties.reduce((sum, p) => sum + p.guestRegistrations.length, 0);
  const totalActiveLinks = userProperties.reduce((sum, p) => sum + p.checkinLinks.length, 0);

  // Guests this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const guestsThisMonth = userProperties.reduce(
    (sum, p) =>
      sum +
      p.guestRegistrations.filter((r) => new Date(r.createdAt) >= monthStart)
        .length,
    0
  );

  return { totalProperties, totalGuests, totalActiveLinks, guestsThisMonth };
}
