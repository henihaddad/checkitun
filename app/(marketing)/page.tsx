"use client";

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Shield,
  FileText,
  Users,
  Smartphone,
  Globe,
  Lock,
  ChevronDown,
  Star,
  Menu,
  X,
  Clock,
  Building2,
  QrCode,
} from "lucide-react";

// ─── Utility: useInView hook ──────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.4s ease",
        background: scrolled ? "rgba(250,248,244,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--olive)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle size={20} color="#e8b96a" />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 20,
              color: scrolled ? "var(--olive)" : "#fff",
              letterSpacing: "-0.3px",
              transition: "color 0.3s",
            }}
          >
            Checki<span style={{ color: "var(--terracotta)" }}>Tun</span>
          </span>
        </a>

        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="nav-links">
          {["Features", "How it Works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{
                textDecoration: "none",
                color: scrolled ? "var(--ink)" : "rgba(255,255,255,0.8)",
                fontSize: 14,
                fontWeight: 500,
                transition: "opacity 0.2s, color 0.3s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              {item}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a
            href="#contact"
            style={{
              padding: "10px 22px",
              borderRadius: 8,
              background: "var(--terracotta)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              transition: "background 0.2s, transform 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--terracotta-light)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--terracotta)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Get Early Access
          </a>
          <button
            onClick={() => setOpen(!open)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }}
            className="nav-hamburger"
          >
            {open ? <X size={22} color="#fff" /> : <Menu size={22} color="#fff" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          style={{
            background: "var(--olive)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "16px 24px 24px",
          }}
        >
          {["Features", "How it Works", "Pricing", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                textDecoration: "none",
                color: "rgba(255,255,255,0.8)",
                fontSize: 16,
                fontWeight: 500,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {item}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div
      className="animate-float"
      style={{
        position: "relative",
        width: 280,
        filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.45))",
      }}
    >
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,98,45,0.25) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div
        style={{
          width: 280,
          background: "#0e0e0e",
          borderRadius: 40,
          padding: "10px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 72, height: 20, background: "#0e0e0e", borderRadius: 10, zIndex: 10 }} />
        <div style={{ background: "var(--bg)", borderRadius: 32, overflow: "hidden", minHeight: 540 }}>
          <div style={{ background: "var(--olive)", padding: "34px 18px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(232,185,106,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={13} color="var(--gold-light)" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>CheckiTun</span>
            </div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>Dar El Medina — Tunis</p>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Welcome, Ahmed!</h3>
          </div>
          <div style={{ padding: "18px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Complete your check-in</p>
            <div style={{ background: "var(--sand)", borderRadius: 6, height: 5, overflow: "hidden" }}>
              <div style={{ width: "66%", height: "100%", background: "var(--olive)", borderRadius: 6 }} />
            </div>
            <p style={{ fontSize: 10, color: "var(--olive)", fontWeight: 600 }}>2 of 3 steps done</p>
            {[
              { label: "Full Name", value: "Ahmed Ben Ali", done: true },
              { label: "Passport No.", value: "TN8823401", done: true },
              { label: "Date of Birth", value: "Tap to fill", done: false },
            ].map(({ label, value, done }) => (
              <div key={label} style={{ padding: "9px 11px", borderRadius: 9, border: `1px solid ${done ? "var(--olive-light)" : "var(--border)"}`, background: done ? "rgba(46,84,66,0.06)" : "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 8, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</p>
                  <p style={{ fontSize: 12, color: done ? "var(--ink)" : "var(--muted)", fontWeight: done ? 500 : 400 }}>{value}</p>
                </div>
                {done && <CheckCircle size={12} color="var(--olive-light)" />}
              </div>
            ))}
            <div style={{ marginTop: 4, padding: "11px", borderRadius: 10, background: "var(--terracotta)", textAlign: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>Continue →</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
              <Lock size={9} color="var(--muted)" />
              <span style={{ fontSize: 8, color: "var(--muted)" }}>Secured & encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "var(--olive)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px 24px 80px",
      }}
    >
      {/* BG decorations */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(232,185,106,0.12)" }} />
        <div style={{ position: "absolute", top: -60, right: -60, width: 380, height: 380, borderRadius: "50%", border: "1px solid rgba(232,185,106,0.07)" }} />
        <div className="animate-float" style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "60% 40% 50% 60% / 50% 60% 40% 50%", background: "rgba(196,98,45,0.1)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "30%", left: "18%", width: 300, height: 300, borderRadius: "50%", background: "rgba(201,148,58,0.07)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="hero-grid">
          {/* Left */}
          <div>
            <div className="animate-fade-in" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(232,185,106,0.35)", background: "rgba(232,185,106,0.08)", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold-light)", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-light)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Built for Tunisia</span>
            </div>

            <h1 className="animate-fade-up delay-100" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px,5vw,64px)", lineHeight: 1.1, fontWeight: 900, color: "#fff", marginBottom: 6, letterSpacing: "-1px" }}>
              Guest check-in,
            </h1>
            <h1 className="animate-fade-up delay-200" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px,5vw,64px)", lineHeight: 1.1, fontWeight: 900, letterSpacing: "-1px", marginBottom: 6 }}>
              <span className="shimmer-text">finally digital.</span>
            </h1>
            <h1 className="animate-fade-up delay-300" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px,5vw,64px)", lineHeight: 1.1, fontWeight: 900, color: "rgba(255,255,255,0.28)", fontStyle: "italic", letterSpacing: "-1px", marginBottom: 36 }}>
              Zero paperwork.
            </h1>

            <p className="animate-fade-up delay-400" style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", maxWidth: 460, marginBottom: 48 }}>
              Send a WhatsApp or SMS link — guests fill in their identity info before arrival. You get legally compliant records, organized automatically. All from your phone.
            </p>

            <div className="animate-fade-up delay-500" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a
                href="#contact"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 12, background: "var(--terracotta)", color: "#fff", fontWeight: 700, fontSize: 16, textDecoration: "none", transition: "all 0.25s ease", boxShadow: "0 4px 24px rgba(196,98,45,0.4)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--terracotta-light)"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(196,98,45,0.5)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--terracotta)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 24px rgba(196,98,45,0.4)"; }}
              >
                Get Early Access <ArrowRight size={18} />
              </a>
              <a
                href="#how-it-works"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 16, textDecoration: "none", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.07)"; el.style.borderColor = "rgba(255,255,255,0.35)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = "rgba(255,255,255,0.18)"; }}
              >
                See how it works
              </a>
            </div>

            <div className="animate-fade-up delay-600" style={{ display: "flex", gap: 28, marginTop: 48, flexWrap: "wrap" }}>
              {[
                { icon: <Shield size={13} />, text: "Legally compliant" },
                { icon: <MessageCircle size={13} />, text: "WhatsApp & SMS" },
                { icon: <Smartphone size={13} />, text: "Mobile-first" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                  <span style={{ color: "var(--gold-light)" }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone */}
          <div className="animate-scale-in delay-300 hero-phone" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <PhoneMockup />
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        <span>Scroll</span>
        <ChevronDown size={13} style={{ animation: "floatY 2s ease-in-out infinite" }} />
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        @keyframes floatY { 0%,100%{transform:translateY(0);} 50%{transform:translateY(5px);} }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hero-phone { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const { ref, inView } = useInView();
  const stats = [
    { value: "< 3 min", label: "Guest check-in time" },
    { value: "100%", label: "Compliant records" },
    { value: "0 TND", label: "Extra hardware needed" },
    { value: "24/7", label: "Accessible dashboard" },
  ];
  return (
    <div ref={ref} style={{ background: "var(--sand)", borderBottom: "1px solid var(--border)", padding: "44px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }} className="stats-grid">
        {stats.map(({ value, label }, i) => (
          <div
            key={label}
            className={inView ? "animate-fade-up" : ""}
            style={{ textAlign: "center", animationDelay: `${i * 0.1}s`, opacity: inView ? undefined : 0, borderRight: i < 3 ? "1px solid var(--border)" : "none", padding: "0 24px" }}
          >
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: "var(--olive)", lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const { ref, inView } = useInView();
  const steps = [
    { number: "01", icon: <MessageCircle size={28} />, title: "Send the link", body: "Copy your personalized CheckiTun link and share it via WhatsApp, SMS, or email directly to your guest before their arrival.", color: "var(--terracotta)" },
    { number: "02", icon: <Smartphone size={28} />, title: "Guest fills their info", body: "Your guest opens the mobile-optimized form on any phone — no app download needed. They enter passport details, nationality, arrival date, and photo.", color: "var(--gold)" },
    { number: "03", icon: <FileText size={28} />, title: "You get compliant records", body: "Records are instantly organized in your dashboard in the legal format required by Tunisian authorities — ready to print, export, or submit.", color: "var(--olive-light)" },
  ];

  return (
    <section id="how-it-works" style={{ padding: "120px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div className={inView ? "animate-fade-in" : ""} style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: "rgba(30,58,47,0.07)", marginBottom: 16, opacity: inView ? undefined : 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--olive)" }}>How it works</span>
          </div>
          <h2 className={inView ? "animate-fade-up delay-100" : ""} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.5px", opacity: inView ? undefined : 0 }}>
            Three steps to a<br />
            <em style={{ color: "var(--terracotta)" }}>paperless check-in.</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, position: "relative" }} className="steps-grid">
          <div style={{ position: "absolute", top: 52, left: "16%", right: "16%", height: 1, background: "repeating-linear-gradient(90deg,var(--border) 0,var(--border) 8px,transparent 8px,transparent 16px)" }} className="steps-line" />
          {steps.map(({ number, icon, title, body, color }, i) => (
            <div
              key={title}
              className={inView ? "animate-fade-up" : ""}
              style={{ animationDelay: `${0.2 + i * 0.15}s`, opacity: inView ? undefined : 0, background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 20, padding: "40px 30px", position: "relative", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-6px)"; el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: -16, left: 30, width: 32, height: 32, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.05em" }}>{number}</div>
              <div style={{ color: color, marginBottom: 20, marginTop: 8 }}>{icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-line { display: none; }
        }
      `}</style>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const { ref, inView } = useInView();
  const features = [
    { icon: <Shield size={22} />, title: "Legally compliant by design", body: "Forms structured to match Tunisian Ministry of Tourism and Interior requirements for guest identification records.", accent: "var(--olive)" },
    { icon: <MessageCircle size={22} />, title: "WhatsApp & SMS delivery", body: "Share your guest link via the most popular channels in Tunisia. No app download required for guests.", accent: "var(--terracotta)" },
    { icon: <QrCode size={22} />, title: "QR code check-in", body: "Generate and print a QR code for your entrance. Guests scan on arrival and fill in their details instantly.", accent: "var(--gold)" },
    { icon: <Lock size={22} />, title: "Encrypted & secure", body: "All guest data is encrypted in transit and at rest. You control who can access records and for how long.", accent: "var(--olive-mid)" },
    { icon: <Clock size={22} />, title: "Pre-arrival collection", body: "Collect guest identity before they arrive — no more waiting at reception, no more handwriting errors.", accent: "var(--terracotta)" },
    { icon: <FileText size={22} />, title: "Export-ready records", body: "Download guest records as PDF or CSV, formatted for official reporting. One click, ready to submit.", accent: "var(--olive)" },
    { icon: <Globe size={22} />, title: "Multi-language forms", body: "Guest forms available in Arabic, French, and English — covering the full range of visitors to Tunisia.", accent: "var(--gold)" },
    { icon: <Building2 size={22} />, title: "Multi-property support", body: "Manage multiple guesthouses, riads, or apartments under one account with separate dashboards.", accent: "var(--olive-mid)" },
  ];

  return (
    <section id="features" style={{ padding: "120px 24px", background: "var(--olive)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -80, left: "30%", width: 400, height: 400, borderRadius: "50%", background: "rgba(196,98,45,0.08)", filter: "blur(80px)" }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }} ref={ref}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }} className="features-layout">
          <div style={{ position: "sticky", top: 120 }} className="features-sticky">
            <div className={inView ? "animate-fade-in" : ""} style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: "rgba(232,185,106,0.12)", marginBottom: 20, opacity: inView ? undefined : 0 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-light)" }}>Features</span>
            </div>
            <h2 className={inView ? "animate-fade-up delay-100" : ""} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,3vw,46px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: 20, opacity: inView ? undefined : 0 }}>
              Everything you need,<br />
              <em style={{ color: "var(--gold-light)" }}>nothing you don&apos;t.</em>
            </h2>
            <p className={inView ? "animate-fade-up delay-200" : ""} style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, opacity: inView ? undefined : 0 }}>
              Built specifically for accommodation providers in Tunisia — not a generic tool adapted for the market.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="features-feats">
            {features.map(({ icon, title, body, accent }, i) => (
              <div
                key={title}
                className={inView ? "animate-fade-up" : ""}
                style={{ animationDelay: `${0.1 + i * 0.07}s`, opacity: inView ? undefined : 0, padding: "26px 22px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", transition: "background 0.3s, border-color 0.3s, transform 0.3s", cursor: "default" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.08)"; el.style.borderColor = `${accent}44`; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.transform = "translateY(0)"; }}
              >
                <div style={{ color: accent, marginBottom: 12 }}>{icon}</div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 7, lineHeight: 1.3 }}>{title}</h4>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .features-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
          .features-sticky { position: static !important; }
        }
        @media (max-width: 600px) {
          .features-feats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Who It's For ─────────────────────────────────────────────────────────────
function WhoItsFor() {
  const { ref, inView } = useInView();
  const types = [
    { icon: "🏡", label: "Guesthouses & Dars", desc: "Small family-run accommodations in medinas and coastal towns looking to simplify compliance." },
    { icon: "🏨", label: "Boutique Hotels", desc: "Independent hotels wanting to modernize check-in without expensive PMS software." },
    { icon: "🏠", label: "Short-term Rentals", desc: "Private hosts who need to meet legal registration requirements without a front desk team." },
    { icon: "🏢", label: "Accommodation Chains", desc: "Multi-property operators who need centralized guest records at scale." },
  ];

  return (
    <section style={{ padding: "120px 24px", background: "var(--sand)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className={inView ? "animate-fade-in" : ""} style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: "rgba(30,58,47,0.07)", marginBottom: 16, opacity: inView ? undefined : 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--olive)" }}>Who it&apos;s for</span>
          </div>
          <h2 className={inView ? "animate-fade-up delay-100" : ""} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, opacity: inView ? undefined : 0 }}>
            Made for every host<br /><em style={{ color: "var(--terracotta)" }}>across Tunisia.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="who-grid">
          {types.map(({ icon, label, desc }, i) => (
            <div key={label} className={inView ? "animate-fade-up" : ""} style={{ animationDelay: `${0.2 + i * 0.1}s`, opacity: inView ? undefined : 0, background: "var(--bg)", borderRadius: 20, padding: "34px 22px", border: "1px solid var(--border)", textAlign: "center", transition: "transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.07)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 38, marginBottom: 14 }}>{icon}</div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{label}</h4>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .who-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 560px) { .who-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const { ref, inView } = useInView();
  const quotes = [
    { text: "Before CheckiTun I was spending 20 minutes per guest filling out paper forms. Now they arrive and everything is already done. It's like magic.", name: "Fatma Belhaj", role: "Owner, Dar Jasmine — Tunis Medina", stars: 5 },
    { text: "The inspection came and my records were perfect — organized by date, all required fields filled. The inspector was genuinely impressed.", name: "Karim Mejri", role: "Manager, Riad Carthage — Sidi Bou Said", stars: 5 },
    { text: "My guests are mostly European tourists. They love checking in from their phone before they even land at Tunis-Carthage airport.", name: "Nour Trabelsi", role: "Host, 3 apartments — Hammamet", stars: 5 },
  ];

  return (
    <section style={{ padding: "120px 24px", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--sand-dark),var(--terracotta),var(--gold),transparent)" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className={inView ? "animate-fade-in" : ""} style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: "rgba(196,98,45,0.08)", marginBottom: 16, opacity: inView ? undefined : 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--terracotta)" }}>Testimonials</span>
          </div>
          <h2 className={inView ? "animate-fade-up delay-100" : ""} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, opacity: inView ? undefined : 0 }}>
            Hosts across Tunisia<br /><em style={{ color: "var(--olive)" }}>love CheckiTun.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="testimonials-grid">
          {quotes.map(({ text, name, role, stars }, i) => (
            <div key={name} className={inView ? "animate-fade-up" : ""} style={{ animationDelay: `${0.2 + i * 0.15}s`, opacity: inView ? undefined : 0, background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 20, padding: "34px 26px", transition: "transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.07)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 60, color: "var(--sand-dark)", lineHeight: 0.8, marginBottom: 14, userSelect: "none" }}>&ldquo;</div>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {Array(stars).fill(null).map((_, si) => <Star key={si} size={13} fill="var(--gold)" color="var(--gold)" />)}
              </div>
              <p style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.7, marginBottom: 22 }}>{text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--olive)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0 }}>{name.charAt(0)}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{name}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const { ref, inView } = useInView();
  const plans = [
    {
      name: "Starter", price: "Free", sub: "Forever", desc: "Perfect for a single host just getting started.",
      features: ["Up to 20 check-ins/month", "WhatsApp & SMS link sharing", "Basic compliance format", "7-day record retention", "Email support"],
      cta: "Get started free", highlight: false, accent: "var(--olive)",
    },
    {
      name: "Host", price: "29 TND", sub: "per month", desc: "For active hosts and small guesthouses.",
      features: ["Unlimited guest check-ins", "QR code check-in", "Full legal compliance export", "1-year record retention", "Multi-language forms (AR/FR/EN)", "Priority support"],
      cta: "Start free trial", highlight: true, accent: "var(--terracotta)",
    },
    {
      name: "Pro", price: "79 TND", sub: "per month", desc: "For hotels and multi-property operators.",
      features: ["Everything in Host", "Up to 10 properties", "Staff accounts", "API access", "Custom branding", "Dedicated account manager"],
      cta: "Contact us", highlight: false, accent: "var(--gold)",
    },
  ];

  return (
    <section id="pricing" style={{ padding: "120px 24px", background: "var(--sand)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className={inView ? "animate-fade-in" : ""} style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: "rgba(30,58,47,0.07)", marginBottom: 16, opacity: inView ? undefined : 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--olive)" }}>Pricing</span>
          </div>
          <h2 className={inView ? "animate-fade-up delay-100" : ""} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, opacity: inView ? undefined : 0 }}>
            Simple, transparent pricing.<br /><em style={{ color: "var(--terracotta)" }}>No surprises.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, alignItems: "center" }} className="pricing-grid">
          {plans.map(({ name, price, sub, desc, features, cta, highlight, accent }, i) => (
            <div key={name} className={inView ? "animate-scale-in" : ""} style={{ animationDelay: `${0.2 + i * 0.12}s`, opacity: inView ? undefined : 0, background: highlight ? "var(--olive)" : "var(--bg)", border: highlight ? "2px solid var(--terracotta)" : "1px solid var(--border)", borderRadius: 24, padding: highlight ? "44px 30px" : "36px 26px", position: "relative", transform: highlight ? "scale(1.03)" : "scale(1)", boxShadow: highlight ? "0 24px 80px rgba(30,58,47,0.22)" : "none" }}>
              {highlight && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", padding: "4px 16px", borderRadius: 20, background: "var(--terracotta)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Most Popular</div>
              )}
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: highlight ? "rgba(255,255,255,0.5)" : "var(--muted)" }}>{name}</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0 2px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 800, color: highlight ? "#fff" : "var(--ink)", lineHeight: 1 }}>{price}</span>
              </div>
              <p style={{ fontSize: 12, color: highlight ? "rgba(255,255,255,0.45)" : "var(--muted)", marginBottom: 8 }}>{sub}</p>
              <p style={{ fontSize: 14, color: highlight ? "rgba(255,255,255,0.65)" : "var(--muted)", marginBottom: 26, lineHeight: 1.6 }}>{desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 28 }}>
                {features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <CheckCircle size={13} color={highlight ? "var(--gold-light)" : accent} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: highlight ? "rgba(255,255,255,0.72)" : "var(--ink)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="#contact" style={{ display: "block", padding: "13px", borderRadius: 11, background: highlight ? "var(--terracotta)" : "transparent", border: highlight ? "none" : `1.5px solid ${accent}`, color: highlight ? "#fff" : accent, fontWeight: 700, fontSize: 14, textAlign: "center", textDecoration: "none", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; if (highlight) { el.style.background = "var(--terracotta-light)"; } else { el.style.background = accent; el.style.color = "#fff"; } }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; if (highlight) { el.style.background = "var(--terracotta)"; } else { el.style.background = "transparent"; el.style.color = accent; } }}
              >{cta}</a>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (email) setSubmitted(true); };

  if (submitted) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 28px", borderRadius: 12, background: "var(--olive)", color: "#fff" }}>
        <CheckCircle size={18} color="var(--gold-light)" />
        <span style={{ fontWeight: 600 }}>You&apos;re on the list! We&apos;ll be in touch soon.</span>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, width: "100%", maxWidth: 440, flexWrap: "wrap", justifyContent: "center" }}>
      <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
        style={{ flex: 1, minWidth: 200, padding: "14px 20px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--cream)", fontSize: 15, color: "var(--ink)", outline: "none", transition: "border-color 0.2s" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--olive)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      />
      <button type="submit" style={{ padding: "14px 26px", borderRadius: 10, border: "none", background: "var(--olive)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.25s ease", display: "flex", alignItems: "center", gap: 8 }}
        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--olive-mid)"; el.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--olive)"; el.style.transform = "translateY(0)"; }}
      >
        Request Access <ArrowRight size={16} />
      </button>
    </form>
  );
}

function CtaSection() {
  const { ref, inView } = useInView();
  return (
    <section id="contact" style={{ padding: "120px 24px", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(30,58,47,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div ref={ref} style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div className={inView ? "animate-fade-in" : ""} style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: "rgba(196,98,45,0.08)", marginBottom: 24, opacity: inView ? undefined : 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--terracotta)" }}>Early Access</span>
        </div>
        <h2 className={inView ? "animate-fade-up delay-100" : ""} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4.5vw,58px)", fontWeight: 900, color: "var(--ink)", lineHeight: 1.12, letterSpacing: "-0.5px", marginBottom: 20, opacity: inView ? undefined : 0 }}>
          Ready to leave the<br /><em style={{ color: "var(--terracotta)" }}>paperwork behind?</em>
        </h2>
        <p className={inView ? "animate-fade-up delay-200" : ""} style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.7, marginBottom: 48, opacity: inView ? undefined : 0 }}>
          Join Tunisia&apos;s first digital guest registration platform. Sign up for early access and be among the first hosts to simplify compliance.
        </p>
        <div className={inView ? "animate-fade-up delay-300" : ""} style={{ display: "flex", justifyContent: "center", opacity: inView ? undefined : 0 }}>
          <EmailSignup />
        </div>
        <p className={inView ? "animate-fade-in delay-500" : ""} style={{ fontSize: 13, color: "var(--muted)", marginTop: 18, opacity: inView ? undefined : 0 }}>
          No credit card required. Free to start.
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "var(--olive)", padding: "64px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(232,185,106,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={15} color="var(--gold-light)" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>
                Checki<span style={{ color: "var(--terracotta-light)" }}>Tun</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 250, marginBottom: 18 }}>
              The digital guest registration platform built for accommodation providers across Tunisia.
            </p>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 6 }}>🇹🇳 Proudly Tunisian</span>
          </div>
          {[
            { heading: "Product", links: ["Features", "How it works", "Pricing", "Security"] },
            { heading: "Support", links: ["Help center", "Contact us", "Privacy policy", "Terms of service"] },
            { heading: "Connect", links: ["WhatsApp", "Facebook", "LinkedIn", "Instagram"] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h5 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>{heading}</h5>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((link) => (
                  <a key={link} href="#" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 26, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.28)" }}>© 2025 CheckiTun. All rights reserved.</p>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <Users size={11} color="rgba(255,255,255,0.28)" />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.28)" }}>Built with hosts in mind, from Tunisia</span>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Features />
      <WhoItsFor />
      <Testimonials />
      <Pricing />
      <CtaSection />
      <Footer />
    </main>
  );
}
