import { getRegistration } from "@/lib/actions/registrations";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileImage, ExternalLink } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, color: value ? "var(--ink)" : "var(--muted)", fontWeight: value ? 500 : 400 }}>
        {value || "—"}
      </p>
    </div>
  );
}

export default async function GuestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reg = await getRegistration(id);
  if (!reg) notFound();

  return (
    <div style={{ padding: "40px 40px 60px", maxWidth: 900 }}>
      <Link href="/dashboard/guests" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13, textDecoration: "none", marginBottom: 28, fontWeight: 500 }}>
        <ArrowLeft size={14} /> Back to guests
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.3px", marginBottom: 8 }}>
          {reg.fullName}
        </h1>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "var(--muted)" }}>
          <span>📍 {reg.property.name}{reg.property.city ? `, ${reg.property.city}` : ""}</span>
          <span>🛂 Passport: {reg.passportNumber}</span>
          <span>📅 Submitted {formatDateTime(new Date(reg.createdAt))}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Identity */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: "24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
            Identity
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Full Name" value={reg.fullName} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Nationality" value={reg.nationality} />
              <Field label="Gender" value={reg.gender} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Passport Number" value={reg.passportNumber} />
              <Field label="Passport Expiry" value={formatDate(reg.passportExpiry)} />
            </div>
            <Field label="Date of Birth" value={formatDate(reg.dateOfBirth)} />
          </div>
        </div>

        {/* Contact & Stay */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: "24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
              Contact
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Phone" value={reg.phone} />
              <Field label="Email" value={reg.email} />
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: "24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
              Stay Details
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Arrival" value={formatDate(reg.arrivalDate)} />
                <Field label="Departure" value={formatDate(reg.departureDate)} />
              </div>
              <Field label="Room Number" value={reg.roomNumber} />
              <Field label="Check-in Link" value={reg.checkinLink.label ?? reg.checkinLink.token} />
            </div>
          </div>
        </div>

        {/* Passport document */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", gridColumn: "1 / -1" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
            Passport Document
          </h2>
          {reg.passportPhotoUrl ? (
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reg.passportPhotoUrl}
                  alt={`${reg.fullName} passport`}
                  style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 12, objectFit: "contain", border: "1px solid var(--border)", display: "block" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a
                  href={reg.passportPhotoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9, border: "1.5px solid var(--border)", background: "#fff", color: "var(--olive)", textDecoration: "none", fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}
                >
                  <ExternalLink size={13} /> Open full size
                </a>
              </div>
            </div>
          ) : (
            <div style={{ padding: "32px", textAlign: "center", background: "var(--sand)", borderRadius: 12 }}>
              <FileImage size={32} color="var(--muted)" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, color: "var(--muted)" }}>No passport photo uploaded</p>
            </div>
          )}
        </div>

        {/* Meta */}
        <div style={{ background: "var(--sand)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", gridColumn: "1 / -1", display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Registration ID</p>
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "var(--ink)" }}>{reg.id}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>IP Address</p>
            <p style={{ fontSize: 13, color: "var(--ink)" }}>{reg.ipAddress ?? "—"}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Submitted At</p>
            <p style={{ fontSize: 13, color: "var(--ink)" }}>{formatDateTime(new Date(reg.submittedAt))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
