// package
import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";

// lib
import { cn } from "@/lib/utils";

// css
import "./globals.css";
import SessionProviderWrapper from "@/components/custom/SessionProviderWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elastica - Recycled rubber products",
  description: "High-quality recycled rubber products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
