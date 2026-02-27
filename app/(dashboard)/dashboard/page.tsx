import { getDashboardStats } from "@/lib/actions/registrations";
import { getUserProperties } from "@/lib/actions/properties";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Building2, Users, Link2, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const [user, stats, recentProperties] = await Promise.all([
    currentUser(),
    getDashboardStats(),
    getUserProperties(),
  ]);

  const firstName = user?.firstName ?? "there";

  const statCards = [
    {
      label: "Properties",
      value: stats.totalProperties,
      icon: <Building2 size={20} />,
      color: "var(--olive)",
      href: "/dashboard/properties",
    },
    {
      label: "Total Guests",
      value: stats.totalGuests,
      icon: <Users size={20} />,
      color: "var(--terracotta)",
      href: "/dashboard/guests",
    },
    {
      label: "Active Links",
      value: stats.totalActiveLinks,
      icon: <Link2 size={20} />,
      color: "var(--gold)",
      href: "/dashboard/properties",
    },
    {
      label: "Guests This Month",
      value: stats.guestsThisMonth,
      icon: <TrendingUp size={20} />,
      color: "var(--olive-light)",
      href: "/dashboard/guests",
    },
  ];

  return (
    <div style={{ padding: "40px 40px 60px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.3px" }}>
          Good morning, {firstName}.
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)" }}>
          Here&apos;s a summary of your CheckiTun dashboard.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {statCards.map(({ label, value, icon, color, href }) => (
          <Link
            key={label}
            href={href}
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "24px 20px",
              textDecoration: "none",
              transition: "box-shadow 0.2s, transform 0.2s",
              display: "block",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color, marginBottom: 16 }}>
              {icon}
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, fontWeight: 500 }}>
              {label}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Properties */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>Properties</h2>
            <Link href="/dashboard/properties" style={{ fontSize: 13, color: "var(--olive)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ padding: "8px 0" }}>
            {recentProperties.length === 0 ? (
              <div style={{ padding: "32px 24px", textAlign: "center" }}>
                <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>No properties yet.</p>
                <Link href="/dashboard/properties" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: "var(--olive)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                  <Plus size={14} /> Add property
                </Link>
              </div>
            ) : (
              recentProperties.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/properties/${p.id}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--sand)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>{p.city ?? "—"} · {p.type}</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--muted)" }}>
                    <span>{p.checkinLinks.length} links</span>
                    <span>{p.guestRegistrations.length} guests</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ background: "var(--olive)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Quick Actions</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Get started or jump to common tasks.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { href: "/dashboard/properties", label: "Add a new property", icon: <Building2 size={15} /> },
              { href: "/dashboard/guests", label: "View guest registrations", icon: <Users size={15} /> },
            ].map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "background 0.15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
              >
                <span style={{ color: "var(--gold-light)" }}>{icon}</span>
                {label}
                <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.5 }} />
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "auto", padding: "16px", borderRadius: 10, background: "rgba(196,98,45,0.15)", border: "1px solid rgba(196,98,45,0.2)" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              📩 To accept guests: add a property, generate a check-in link, and share it via WhatsApp or SMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
