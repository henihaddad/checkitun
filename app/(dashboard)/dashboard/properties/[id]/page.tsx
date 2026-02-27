import { getProperty } from "@/lib/actions/properties";
import { notFound } from "next/navigation";
import { getCheckinUrl, formatDate, formatDateTime } from "@/lib/utils";
import { CheckinLinkPanel } from "./checkin-link-panel";
import Link from "next/link";
import { ArrowLeft, Users, MapPin, Phone, Mail } from "lucide-react";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  return (
    <div style={{ padding: "40px 40px 60px" }}>
      {/* Back link */}
      <Link href="/dashboard/properties" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13, textDecoration: "none", marginBottom: 28, fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back to properties
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, background: "var(--sand)", color: "var(--olive)" }}>
              {property.type}
            </span>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: property.isActive ? "#4ade80" : "var(--muted)", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{property.isActive ? "Active" : "Inactive"}</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.3px", marginBottom: 10 }}>
            {property.name}
          </h1>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {property.city && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--muted)" }}>
                <MapPin size={13} /> {property.city}{property.address ? `, ${property.address}` : ""}
              </span>
            )}
            {property.phone && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--muted)" }}>
                <Phone size={13} /> {property.phone}
              </span>
            )}
            {property.email && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--muted)" }}>
                <Mail size={13} /> {property.email}
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)" }}>
            {property.guestRegistrations.length}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
            <Users size={12} /> total guests
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {/* Check-in Links */}
        <CheckinLinkPanel
          propertyId={property.id}
          links={property.checkinLinks.map((l) => ({
            ...l,
            url: getCheckinUrl(l.token),
          }))}
        />

        {/* Recent Guests */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>Recent Guests</h2>
            <Link href="/dashboard/guests" style={{ fontSize: 13, color: "var(--olive)", textDecoration: "none", fontWeight: 600 }}>
              View all
            </Link>
          </div>
          {property.guestRegistrations.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
              No guests yet. Share a check-in link to get started.
            </div>
          ) : (
            <div>
              {property.guestRegistrations.map((g) => (
                <Link
                  key={g.id}
                  href={`/dashboard/guests/${g.id}`}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", textDecoration: "none", borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--sand)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{g.fullName}</p>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>{g.nationality} · {formatDate(g.arrivalDate)} → {formatDate(g.departureDate)}</p>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    {formatDateTime(new Date(g.createdAt))}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
