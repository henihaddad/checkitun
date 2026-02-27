import { headers } from "next/headers";
import { Webhook } from "svix";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

type ClerkUserPayload = {
  id: string;
  email_addresses: Array<{ email_address: string; id: string }>;
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: { type: string; data: ClerkUserPayload };

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as { type: string; data: ClerkUserPayload };
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    )?.email_address;

    if (!primaryEmail) {
      return new Response("No primary email", { status: 400 });
    }

    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

    await db.insert(users).values({
      id: data.id,
      email: primaryEmail,
      name,
    });
  }

  if (type === "user.updated") {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    )?.email_address;

    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

    await db
      .update(users)
      .set({
        email: primaryEmail ?? undefined,
        name,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.id));
  }

  if (type === "user.deleted") {
    await db.delete(users).where(eq(users.id, data.id));
  }

  return new Response("OK", { status: 200 });
}
