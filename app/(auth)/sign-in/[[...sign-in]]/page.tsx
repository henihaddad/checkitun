import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--olive)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(232,185,106,0.12)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "60% 40% 50% 60% / 50% 60% 40% 50%", background: "rgba(196,98,45,0.1)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="CheckiTun" style={{ width: 40, height: 40, borderRadius: 10 }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: "#fff" }}>
            Checki<span style={{ color: "var(--terracotta)" }}>Tun</span>
          </span>
        </a>

        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#1e3a2f",
              colorText: "#1c1a17",
              colorBackground: "#fdf9f4",
              borderRadius: "12px",
              fontFamily: "DM Sans, sans-serif",
            },
            elements: {
              card: { boxShadow: "0 24px 80px rgba(0,0,0,0.3)" },
              formButtonPrimary: { backgroundColor: "#1e3a2f", "&:hover": { backgroundColor: "#2e5442" } },
            },
          }}
        />
      </div>
    </div>
  );
}
