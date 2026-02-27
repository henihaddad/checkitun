import { db, checkinLinks } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CheckinForm } from "./checkin-form";

export default async function CheckinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const link = await db.query.checkinLinks.findFirst({
    where: and(eq(checkinLinks.token, token), eq(checkinLinks.isActive, true)),
    with: { property: true },
  });

  if (!link) notFound();

  if (link.expiresAt && link.expiresAt < new Date()) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>⏰</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>
            This link has expired
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15 }}>
            Please contact {link.property.name} for a new check-in link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ background: "var(--olive)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="CheckiTun" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Digital Check-in
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>
              {link.property.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.3px" }}>
            Welcome! Please complete your registration.
          </h2>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
            This information is required by Tunisian law for all accommodation guests. Your data is encrypted and secure.
          </p>
        </div>

        <CheckinForm
          checkinLinkId={link.id}
          propertyId={link.propertyId}
          token={token}
        />
      </div>
    </div>
  );
}
