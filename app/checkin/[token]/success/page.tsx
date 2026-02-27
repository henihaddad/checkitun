import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckinSuccessPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "var(--olive)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="CheckiTun" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>
            Checki<span style={{ color: "var(--terracotta-light)" }}>Tun</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          {/* Success icon */}
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "var(--olive)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 12px 40px rgba(30,58,47,0.25)" }}>
            <CheckCircle size={36} color="var(--gold-light)" />
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, color: "var(--ink)", letterSpacing: "-0.5px", marginBottom: 14, lineHeight: 1.1 }}>
            Check-in complete!
          </h1>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, marginBottom: 36 }}>
            Your registration has been submitted successfully. Your host has received your information and you&apos;re all set.
          </p>

          {/* Info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            {[
              { icon: "🔒", title: "Secure & compliant", body: "Your data is encrypted and handled in accordance with Tunisian privacy regulations." },
              { icon: "📋", title: "Legally filed", body: "Your registration has been recorded in the legally required format." },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 20px", textAlign: "left", display: "flex", gap: 14 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Powered by */}
          <div style={{ paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>
              Powered by{" "}
              <Link href="/" style={{ color: "var(--olive)", textDecoration: "none", fontWeight: 600 }}>
                CheckiTun
              </Link>
              {" "}— Digital guest registration for Tunisia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
