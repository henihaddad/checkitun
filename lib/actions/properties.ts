"use server";

import { auth } from "@clerk/nextjs/server";
import { db, properties } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const propertySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  address: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(["hotel", "guesthouse", "rental", "other"]),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export async function createProperty(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    type: formData.get("type") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
  };

  const parsed = propertySchema.parse(raw);

  const [property] = await db
    .insert(properties)
    .values({ ...parsed, userId, email: parsed.email || null })
    .returning();

  revalidatePath("/dashboard/properties");
  return property;
}

export async function updateProperty(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    type: formData.get("type") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
  };

  const parsed = propertySchema.parse(raw);

  await db
    .update(properties)
    .set({ ...parsed, email: parsed.email || null, updatedAt: new Date() })
    .where(and(eq(properties.id, id), eq(properties.userId, userId)));

  revalidatePath(`/dashboard/properties/${id}`);
  revalidatePath("/dashboard/properties");
}

export async function deleteProperty(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(properties)
    .where(and(eq(properties.id, id), eq(properties.userId, userId)));

  revalidatePath("/dashboard/properties");
}

export async function getUserProperties() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.properties.findMany({
    where: eq(properties.userId, userId),
    orderBy: (p, { desc }) => [desc(p.createdAt)],
    with: {
      checkinLinks: {
        where: (l, { eq }) => eq(l.isActive, true),
      },
      guestRegistrations: true,
    },
  });
}

export async function getProperty(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.properties.findFirst({
    where: and(eq(properties.id, id), eq(properties.userId, userId)),
    with: {
      checkinLinks: {
        orderBy: (l, { desc }) => [desc(l.createdAt)],
      },
      guestRegistrations: {
        orderBy: (r, { desc }) => [desc(r.createdAt)],
        limit: 10,
      },
    },
  });
}
