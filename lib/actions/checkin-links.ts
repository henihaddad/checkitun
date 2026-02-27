"use server";

import { auth } from "@clerk/nextjs/server";
import { db, checkinLinks, properties } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { generateToken } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createCheckinLink(
  propertyId: string,
  label?: string,
  expiresAt?: Date
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verify ownership
  const property = await db.query.properties.findFirst({
    where: and(eq(properties.id, propertyId), eq(properties.userId, userId)),
  });
  if (!property) throw new Error("Property not found");

  const token = generateToken();

  const [link] = await db
    .insert(checkinLinks)
    .values({
      propertyId,
      token,
      label: label ?? null,
      expiresAt: expiresAt ?? null,
    })
    .returning();

  revalidatePath(`/dashboard/properties/${propertyId}`);
  return link;
}

export async function deactivateCheckinLink(linkId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verify ownership via property
  const link = await db.query.checkinLinks.findFirst({
    where: eq(checkinLinks.id, linkId),
    with: { property: true },
  });

  if (!link || link.property.userId !== userId) {
    throw new Error("Not found");
  }

  await db
    .update(checkinLinks)
    .set({ isActive: false })
    .where(eq(checkinLinks.id, linkId));

  revalidatePath(`/dashboard/properties/${link.propertyId}`);
}

export async function deleteCheckinLink(linkId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const link = await db.query.checkinLinks.findFirst({
    where: eq(checkinLinks.id, linkId),
    with: { property: true },
  });

  if (!link || link.property.userId !== userId) {
    throw new Error("Not found");
  }

  await db.delete(checkinLinks).where(eq(checkinLinks.id, linkId));
  revalidatePath(`/dashboard/properties/${link.propertyId}`);
}
