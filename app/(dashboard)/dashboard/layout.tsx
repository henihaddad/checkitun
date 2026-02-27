export const dynamic = "force-dynamic";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle, LayoutDashboard, Building2, Users, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Overview" },
    { href: "/dashboard/properties", icon: <Building2 size={18} />, label: "Properties" },
    { href: "/dashboard/guests", icon: <Users size={18} />, label: "Guests" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "var(--olive)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(232,185,106,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={16} color="var(--gold-light)" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>
              Checki<span style={{ color: "var(--terracotta-light)" }}>Tun</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
              }}
            >
              <span style={{ color: "inherit" }}>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom user */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: 32, height: 32 },
              },
            }}
          />
          <Link href="/" style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.15s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
          >
            <LogOut size={15} />
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
