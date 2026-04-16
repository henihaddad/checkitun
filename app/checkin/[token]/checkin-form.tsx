"use client";

import { useState, useRef } from "react";
import { submitRegistration } from "@/lib/actions/registrations";
import { useRouter } from "next/navigation";
import { Upload, X, CheckCircle, Lock, Sparkles } from "lucide-react";

type OcrFields = {
  fullName: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "";
};

const EMPTY_OCR: OcrFields = {
  fullName: "",
  nationality: "",
  passportNumber: "",
  passportExpiry: "",
  dateOfBirth: "",
  gender: "",
};

async function preprocessImage(file: File, maxDim = 1024, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/jpeg",
      quality,
    );
  });
}

const NATIONALITIES = [
  "Tunisian","Algerian","Libyan","Moroccan","Egyptian","French","German","Italian",
  "Spanish","British","American","Canadian","Belgian","Dutch","Swiss","Swedish",
  "Norwegian","Danish","Finnish","Polish","Czech","Hungarian","Romanian","Greek",
  "Portuguese","Turkish","Emirati","Saudi","Qatari","Jordanian","Lebanese","Other",
].sort();

type Props = {
  checkinLinkId: string;
  propertyId: string;
  token: string;
};

export function CheckinForm({ checkinLinkId, propertyId, token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done">("idle");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoKey, setPhotoKey] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [ocr, setOcr] = useState<OcrFields>(EMPTY_OCR);
  const [ocrState, setOcrState] = useState<"idle" | "reading" | "done" | "failed">("idle");
  const [ocrMsg, setOcrMsg] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [step, setStep] = useState<"upload" | "identity" | "details">("upload");
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 10,
    border: "1.5px solid var(--border)",
    background: "#fff",
    fontSize: 15,
    color: "var(--ink)",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 7,
  };

  const sectionStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "24px 20px",
    marginBottom: 16,
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a photo of your passport (JPEG, PNG, or WebP).");
      return;
    }

    // Client-side resize + EXIF rotation
    let uploadFile: Blob = file;
    try {
      uploadFile = await preprocessImage(file);
    } catch {
      uploadFile = file; // fall back to original on canvas error
    }

    setPhotoPreview(URL.createObjectURL(uploadFile));

    // Upload to Blob
    setUploadProgress("uploading");
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", uploadFile, "passport.jpg");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setPhotoUrl(data.url);
      setPhotoKey(data.pathname);
      setUploadProgress("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadProgress("idle");
      setPhotoPreview(null);
      return;
    }

    setOcrState("reading");
    setOcrMsg("");
    try {
      const fd = new FormData();
      fd.append("file", uploadFile, "passport.jpg");
      fd.append("checkinLinkId", checkinLinkId);
      const res = await fetch("/api/passport-ocr", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setOcrState("failed");
        setOcrMsg(data.error ?? "Could not read passport.");
        setStep("identity");
        return;
      }
      setOcr({
        fullName: data.fullName ?? "",
        nationality: data.nationality ?? "",
        passportNumber: data.passportNumber ?? "",
        passportExpiry: data.passportExpiry ?? "",
        dateOfBirth: data.dateOfBirth ?? "",
        gender: (data.gender ?? "") as OcrFields["gender"],
      });
      setFormKey((k) => k + 1); // re-mount inputs so defaultValues apply
      setOcrState("done");
      setStep("identity");
    } catch {
      setOcrState("failed");
      setOcrMsg("Network error while reading passport.");
      setStep("identity");
    }
  }

  const nationalityOptions = ocr.nationality && !NATIONALITIES.includes(ocr.nationality)
    ? [ocr.nationality, ...NATIONALITIES]
    : NATIONALITIES;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const data = {
      checkinLinkId,
      propertyId,
      fullName: fd.get("fullName") as string,
      nationality: fd.get("nationality") as string,
      passportNumber: fd.get("passportNumber") as string,
      passportExpiry: fd.get("passportExpiry") as string,
      dateOfBirth: fd.get("dateOfBirth") as string,
      gender: fd.get("gender") as "male" | "female" | "other",
      phone: fd.get("phone") as string,
      email: (fd.get("email") as string) || "",
      arrivalDate: fd.get("arrivalDate") as string,
      departureDate: fd.get("departureDate") as string,
      roomNumber: (fd.get("roomNumber") as string) || "",
      passportPhotoUrl: photoUrl,
      passportPhotoKey: photoKey,
    };

    try {
      await submitRegistration(data);
      router.push(`/checkin/${token}/success`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      {/* Passport photo — always first, drives the flow */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
          {step === "upload" ? "Start with your passport" : "Passport Photo"}
        </h3>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>
          {step === "upload"
            ? "Snap a photo of your passport data page and we'll fill the form for you."
            : "We read this automatically — please verify the fields below."}
        </p>

        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} style={{ display: "none" }} />

        {photoPreview ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoPreview} alt="Passport preview" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 10, objectFit: "cover", display: "block" }} />
            {uploadProgress === "done" && (
              <div style={{ position: "absolute", top: 8, right: 8, background: "#4ade80", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={14} color="#fff" />
              </div>
            )}
            <button type="button" onClick={() => { setPhotoPreview(null); setPhotoUrl(""); setPhotoKey(""); setUploadProgress("idle"); setOcrState("idle"); setOcr(EMPTY_OCR); setFormKey((k) => k + 1); setStep("upload"); if (fileRef.current) fileRef.current.value = ""; }}
              style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={12} color="#fff" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()}
            style={{ width: "100%", padding: "36px 20px", borderRadius: 12, border: "2px dashed var(--border)", background: "var(--sand)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transition: "border-color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <Upload size={26} color="var(--muted)" />
            <span style={{ fontSize: 15, color: "var(--muted)", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
              {uploadProgress === "uploading" ? "Uploading…" : "Tap to upload passport photo"}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", opacity: 0.8 }}>JPEG, PNG, or WebP · max 10 MB</span>
          </button>
        )}

        {(ocrState === "reading" || ocrState === "done" || ocrState === "failed") && (
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 10,
              background:
                ocrState === "done"
                  ? "rgba(30,58,47,0.06)"
                  : ocrState === "failed"
                  ? "rgba(196,98,45,0.08)"
                  : "rgba(30,58,47,0.04)",
              border:
                ocrState === "failed"
                  ? "1px solid rgba(196,98,45,0.2)"
                  : "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Sparkles size={16} color={ocrState === "failed" ? "var(--terracotta)" : "var(--olive)"} />
            <span style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.4 }}>
              {ocrState === "reading" && "Reading passport…"}
              {ocrState === "done" && "Fields filled from your passport — please verify them below."}
              {ocrState === "failed" && (ocrMsg || "Could not read passport. Please fill the fields below manually.")}
            </span>
          </div>
        )}

        {step === "upload" && (
          <button
            type="button"
            onClick={() => setStep("identity")}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Or fill the form manually
          </button>
        )}
      </div>

      {step !== "upload" && (
      <>
      {/* Identity */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}>
          Identity
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input key={`n-${formKey}`} name="fullName" required defaultValue={ocr.fullName} placeholder="As it appears on your passport" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Nationality *</label>
              <select key={`nat-${formKey}`} name="nationality" required defaultValue={ocr.nationality} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                <option value="">Select…</option>
                {nationalityOptions.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Gender *</label>
              <select key={`g-${formKey}`} name="gender" required defaultValue={ocr.gender} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Passport Number *</label>
              <input key={`pn-${formKey}`} name="passportNumber" required defaultValue={ocr.passportNumber} placeholder="e.g. TN8823401" style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
            <div>
              <label style={labelStyle}>Passport Expiry *</label>
              <input key={`pe-${formKey}`} name="passportExpiry" type="date" required defaultValue={ocr.passportExpiry} style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Date of Birth *</label>
            <input key={`dob-${formKey}`} name="dateOfBirth" type="date" required defaultValue={ocr.dateOfBirth} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
      </div>

      {step === "identity" && (
        <button
          type="button"
          onClick={() => {
            // Require the identity fields before advancing
            if (!formRef.current?.reportValidity()) return;
            setStep("details");
          }}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 12,
            border: "none",
            background: "var(--olive)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
            marginBottom: 20,
          }}
        >
          Confirm details →
        </button>
      )}

      {step === "details" && (
      <>
      {/* Contact */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}>
          Contact
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input name="phone" type="tel" required placeholder="+216 xx xxx xxx" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
          <div>
            <label style={labelStyle}>Email <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <input name="email" type="email" placeholder="your@email.com" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
      </div>

      {/* Stay */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}>
          Your Stay
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Arrival Date *</label>
              <input name="arrivalDate" type="date" required style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
            <div>
              <label style={labelStyle}>Departure Date *</label>
              <input name="departureDate" type="date" required style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Room Number <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <input name="roomNumber" placeholder="e.g. 12 or Suite A" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
      </div>
      </>
      )}
      </>
      )}

      {error && (
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(196,98,45,0.08)", border: "1px solid rgba(196,98,45,0.2)", marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: "var(--terracotta)", fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {step === "details" && (
      <button
        type="submit"
        disabled={loading || uploadProgress === "uploading"}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 12,
          border: "none",
          background: loading ? "var(--muted)" : "var(--olive)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "DM Sans, sans-serif",
          transition: "background 0.2s",
          marginBottom: 20,
        }}
      >
        {loading ? "Submitting…" : "Complete Check-in →"}
      </button>
      )}

      {/* Security note */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--muted)", fontSize: 12 }}>
        <Lock size={12} />
        Your data is encrypted and only accessible to your host.
      </div>
    </form>
  );
}
