import { getGuestRegistrations } from "@/lib/actions/registrations";
import Link from "next/link";
import { Users, Search, ArrowRight, Download } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import { GuestSearch } from "./guest-search";

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const guests = await getGuestRegistrations(q);

  return (
    <div style={{ padding: "40px 40px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.3px", marginBottom: 6 }}>
            Guest Registrations
          </h1>
          <p style={{ fontSize: 15, color: "var(--muted)" }}>
            {guests.length} record{guests.length !== 1 ? "s" : ""}{q ? ` matching "${q}"` : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href={`/api/export/guests${q ? `?q=${encodeURIComponent(q)}` : ""}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: "1.5px solid var(--border)", background: "#fff", color: "var(--muted)", textDecoration: "none", fontSize: 13, fontWeight: 600, transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--olive)"; (e.currentTarget as HTMLElement).style.color = "var(--olive)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
          >
            <Download size={14} /> Export CSV
          </a>
        </div>
      </div>

      {/* Search */}
      <GuestSearch defaultValue={q} />

      {/* Table */}
      {guests.length === 0 ? (
        <div style={{ background: "#fff", border: "2px dashed var(--border)", borderRadius: 20, padding: "80px 40px", textAlign: "center", marginTop: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--sand)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            {q ? <Search size={24} color="var(--muted)" /> : <Users size={24} color="var(--muted)" />}
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>
            {q ? "No results found" : "No guest registrations yet"}
          </h3>
          <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 360, margin: "0 auto" }}>
            {q
              ? `No guests match "${q}". Try a different name, passport number, or nationality.`
              : "Share a check-in link with your guests to start collecting registrations."}
          </p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginTop: 20 }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr 40px", gap: 0, padding: "12px 24px", borderBottom: "1px solid var(--border)", background: "var(--sand)" }}>
            {["Guest", "Nationality", "Property", "Stay", "Submitted", ""].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {guests.map((g) => (
            <Link
              key={g.id}
              href={`/dashboard/guests/${g.id}`}
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr 40px", gap: 0, padding: "14px 24px", borderBottom: "1px solid var(--border)", textDecoration: "none", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--sand)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{g.fullName}</p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>{g.passportNumber}</p>
              </div>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{g.nationality}</span>
              <div>
                <p style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{g.property.name}</p>
                <p style={{ fontSize: 11, color: "var(--muted)" }}>{g.property.city ?? ""}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>{formatDate(g.arrivalDate)}</p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>→ {formatDate(g.departureDate)}</p>
              </div>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{formatDateTime(new Date(g.createdAt))}</span>
              <ArrowRight size={14} color="var(--muted)" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
