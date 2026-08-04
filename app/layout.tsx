import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "GearUp | Sports Gear Rentals",
  description: "Rent sports and outdoor equipment instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 text-zinc-950">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
