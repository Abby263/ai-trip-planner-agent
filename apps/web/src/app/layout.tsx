import type { Metadata } from "next";
import "./globals.css";

import { AppShell } from "@/components/common/AppShell";
import { Providers } from "@/components/common/Providers";

export const metadata: Metadata = {
  title: "AI Trip Planner Agent",
  description: "A source-backed AI travel concierge with map-native itinerary planning."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
