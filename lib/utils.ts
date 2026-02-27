import { customAlphabet } from "nanoid";
import { format, parseISO } from "date-fns";

// ─── Token generation ─────────────────────────────────────────────────────────

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  21
);

export function generateToken(): string {
  return nanoid();
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function formatDate(dateStr: string | Date): string {
  const d = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  return format(d, "dd MMM yyyy");
}

export function formatDateTime(date: Date): string {
  return format(date, "dd MMM yyyy, HH:mm");
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

export function getCheckinUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/checkin/${token}`;
}

// ─── CSV export ───────────────────────────────────────────────────────────────

export function registrationsToCSV(
  rows: Array<Record<string, string | number | Date | null | undefined>>
): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v == null) return "";
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];
  return lines.join("\n");
}
