import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CheckiTun — Digital Guest Registration for Tunisia",
  description:
    "CheckiTun is the mobile-first digital guest registration and compliance platform for accommodation providers in Tunisia. Collect, verify, and manage guest identity online — before arrival.",
  keywords: "guest registration, Tunisia, hotel compliance, digital check-in, accommodation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
