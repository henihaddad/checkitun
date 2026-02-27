import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "CheckiTun — Digital Guest Registration for Tunisia",
  description:
    "CheckiTun is the mobile-first digital guest registration and compliance platform for accommodation providers in Tunisia.",
  keywords: "guest registration, Tunisia, hotel compliance, digital check-in",
  openGraph: {
    title: "CheckiTun",
    description: "Digital guest registration for Tunisia",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="en">
      <body>{children}</body>
    </html>
  );

  return publishableKey ? (
    <ClerkProvider publishableKey={publishableKey}>{content}</ClerkProvider>
  ) : (
    content
  );
}
