import { NextRequest, NextResponse } from "next/server";
import { db, checkinLinks } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = "google/gemini-3.1-flash-lite-preview";
const MAX_BYTES = 4 * 1024 * 1024;

const SCHEMA = {
  type: "object",
  properties: {
    fullName: { type: "string" },
    nationality: { type: "string", description: "Full English demonym (e.g. Italian, Tunisian, Moroccan). Empty string if unreadable." },
    passportNumber: { type: "string" },
    passportExpiry: { type: "string", description: "YYYY-MM-DD" },
    dateOfBirth: { type: "string", description: "YYYY-MM-DD" },
    gender: { type: "string", enum: ["male", "female", "other"] },
  },
  required: ["fullName", "nationality", "passportNumber", "passportExpiry", "dateOfBirth", "gender"],
  additionalProperties: false,
} as const;

const PROMPT =
  "Extract passport data from this image. If the image is not a passport or the fields are unreadable, return empty strings and gender 'other'. Never invent data. Use the full English demonym for nationality (e.g. Italian, Tunisian), not an MRZ country code.";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OCR not configured" }, { status: 503 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const checkinLinkId = form.get("checkinLinkId") as string | null;

  if (!file || !checkinLinkId) {
    return NextResponse.json({ error: "Missing file or checkinLinkId" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images supported for OCR" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large (max 4MB after client preprocessing)" }, { status: 400 });
  }

  // Gate: only callable with a valid active check-in link
  const link = await db.query.checkinLinks.findFirst({
    where: and(eq(checkinLinks.id, checkinLinkId), eq(checkinLinks.isActive, true)),
  });
  if (!link) {
    return NextResponse.json({ error: "Invalid check-in link" }, { status: 403 });
  }
  if (link.expiresAt && link.expiresAt < new Date()) {
    return NextResponse.json({ error: "Check-in link expired" }, { status: 403 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buf.toString("base64")}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://checkitun.tn",
      "X-Title": "CheckiTun",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "passport", strict: true, schema: SCHEMA },
      },
      max_tokens: 400,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("OpenRouter error", res.status, text);
    return NextResponse.json({ error: "OCR provider failed" }, { status: 502 });
  }

  const j = await res.json();
  const content: string | undefined = j.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "Empty OCR response" }, { status: 502 });
  }

  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(content.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    return NextResponse.json({ error: "Malformed OCR response" }, { status: 502 });
  }

  const empty =
    !parsed.fullName && !parsed.passportNumber && !parsed.dateOfBirth && !parsed.passportExpiry;
  if (empty) {
    return NextResponse.json({ error: "Could not read passport. Please retake the photo." }, { status: 422 });
  }

  return NextResponse.json(parsed);
}
