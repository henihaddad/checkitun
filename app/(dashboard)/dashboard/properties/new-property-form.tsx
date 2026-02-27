"use client";

import { useState } from "react";
import { createProperty } from "@/lib/actions/properties";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export function NewPropertyForm({ showAsButton }: { showAsButton?: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      await createProperty(fd);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 8,
    border: "1.5px solid var(--border)",
    background: "var(--cream)",
    fontSize: 14,
    color: "var(--ink)",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 6,
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: showAsButton ? "12px 24px" : "10px 20px",
          borderRadius: 10,
          background: "var(--olive)",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          fontFamily: "DM Sans, sans-serif",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--olive-mid)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--olive)")}
      >
        <Plus size={16} /> Add Property
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Backdrop */}
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div style={{ position: "relative", background: "#fff", borderRadius: 20, padding: "32px", width: "100%", maxWidth: 480, boxShadow: "0 32px 80px rgba(0,0,0,0.2)", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>
                New Property
              </h2>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Property name *</label>
                <input name="name" required placeholder="Dar El Medina" style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Type *</label>
                  <select name="type" required style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                    <option value="guesthouse">Guesthouse / Dar</option>
                    <option value="hotel">Hotel</option>
                    <option value="rental">Short-term Rental</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input name="city" placeholder="Tunis" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Address</label>
                <input name="address" placeholder="12 Rue de la Kasbah" style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input name="phone" type="tel" placeholder="+216 xx xxx xxx" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input name="email" type="email" placeholder="property@email.com" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>
              </div>

              {error && (
                <p style={{ fontSize: 13, color: "var(--terracotta)", padding: "10px 14px", borderRadius: 8, background: "rgba(196,98,45,0.08)" }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setOpen(false)}
                  style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid var(--border)", background: "transparent", color: "var(--muted)", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: loading ? "var(--muted)" : "var(--olive)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", transition: "background 0.2s" }}
                >
                  {loading ? "Creating…" : "Create Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
