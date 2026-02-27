"use client";

import { useState } from "react";
import { createCheckinLink, deactivateCheckinLink } from "@/lib/actions/checkin-links";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Link2, Plus, QrCode, Pause } from "lucide-react";
import type { CheckinLink } from "@/lib/db/schema";

type LinkWithUrl = CheckinLink & { url: string };

export function CheckinLinkPanel({
  propertyId,
  links,
}: {
  propertyId: string;
  links: LinkWithUrl[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [qrLink, setQrLink] = useState<LinkWithUrl | null>(null);
  const [label, setLabel] = useState("");

  async function handleCreate() {
    setLoading(true);
    try {
      await createCheckinLink(propertyId, label || undefined);
      setLabel("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate(linkId: string) {
    await deactivateCheckinLink(linkId);
    router.refresh();
  }

  function copyToClipboard(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid var(--border)",
    background: "var(--cream)",
    fontSize: 13,
    color: "var(--ink)",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
  };

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
          Check-in Links
        </h2>
        <p style={{ fontSize: 12, color: "var(--muted)" }}>
          Share these with guests via WhatsApp or SMS.
        </p>
      </div>

      {/* Create new link */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (optional, e.g. Room 12)"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8, background: "var(--olive)", color: "#fff", border: "none", fontWeight: 600, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap" }}
        >
          <Plus size={14} /> {loading ? "…" : "New Link"}
        </button>
      </div>

      {/* Links list */}
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {links.length === 0 ? (
          <div style={{ padding: "32px 24px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
            No links yet. Create your first one above.
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <Link2 size={12} color="var(--olive)" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {link.label || "Check-in link"}
                  </span>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: link.isActive ? "#4ade80" : "var(--muted)", flexShrink: 0 }} />
                </div>
                <p style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {link.url}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => copyToClipboard(link.url, link.id)}
                  title="Copy link"
                  style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)", background: copied === link.id ? "var(--olive)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                >
                  {copied === link.id ? <Check size={13} color="#fff" /> : <Copy size={13} color="var(--muted)" />}
                </button>
                <button
                  onClick={() => setQrLink(link)}
                  title="Show QR code"
                  style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <QrCode size={13} color="var(--muted)" />
                </button>
                {link.isActive && (
                  <button
                    onClick={() => handleDeactivate(link.id)}
                    title="Deactivate"
                    style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Pause size={13} color="var(--muted)" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* QR Modal */}
      {qrLink && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setQrLink(null)} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 20, padding: "36px 36px 28px", textAlign: "center", zIndex: 1, boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
              {qrLink.label || "Check-in QR Code"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
              Print and place at your property entrance.
            </p>
            <div style={{ padding: 20, background: "var(--sand)", borderRadius: 16, display: "inline-block", marginBottom: 20 }}>
              <QRCodeSVG value={qrLink.url} size={200} fgColor="var(--ink)" bgColor="transparent" />
            </div>
            <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 20, wordBreak: "break-all", maxWidth: 260 }}>
              {qrLink.url}
            </p>
            <button
              onClick={() => setQrLink(null)}
              style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: "var(--olive)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
