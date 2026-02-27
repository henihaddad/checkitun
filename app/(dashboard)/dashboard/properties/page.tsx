import { getUserProperties } from "@/lib/actions/properties";
import Link from "next/link";
import { Plus, Building2, Link2, Users, ArrowRight, MapPin } from "lucide-react";
import { NewPropertyForm } from "./new-property-form";

export default async function PropertiesPage() {
  const properties = await getUserProperties();

  return (
    <div style={{ padding: "40px 40px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.3px", marginBottom: 6 }}>
            Properties
          </h1>
          <p style={{ fontSize: 15, color: "var(--muted)" }}>
            Manage your accommodations and their check-in links.
          </p>
        </div>
        <NewPropertyForm />
      </div>

      {properties.length === 0 ? (
        <div style={{ background: "#fff", border: "2px dashed var(--border)", borderRadius: 20, padding: "80px 40px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--sand)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Building2 size={24} color="var(--muted)" />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>
            No properties yet
          </h3>
          <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: 360, margin: "0 auto 28px" }}>
            Add your first guesthouse, hotel, or rental to start generating check-in links.
          </p>
          <NewPropertyForm showAsButton />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/properties/${p.id}`}
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 18,
                padding: "24px",
                textDecoration: "none",
                display: "block",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Type badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, background: "var(--sand)", color: "var(--olive)" }}>
                  {p.type}
                </span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.isActive ? "#4ade80" : "var(--muted)", display: "inline-block", marginTop: 6 }} />
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 6, lineHeight: 1.2 }}>
                {p.name}
              </h3>

              {p.city && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>
                  <MapPin size={12} />
                  {p.city}
                </div>
              )}

              <div style={{ display: "flex", gap: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--muted)" }}>
                  <Link2 size={13} color="var(--olive)" />
                  <span>{p.checkinLinks.length} active links</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--muted)" }}>
                  <Users size={13} color="var(--terracotta)" />
                  <span>{p.guestRegistrations.length} guests</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--olive)", fontWeight: 600, marginTop: 14 }}>
                Manage <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
