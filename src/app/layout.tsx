// package
import type { Metadata } from "next";
// import { Poppins, Inter } from "next/font/google";

// lib
import { cn } from "@/lib/utils";

// css
import "./globals.css";
import SessionProviderWrapper from "@/components/custom/SessionProviderWrapper";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
//   variable: "--font-poppins",
//   display: "swap",
// });

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-inter",
//   display: "swap",
// });

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
      <head>
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link rel="icon"  href="/elastica.png" />
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /> */}
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}

      </head>
      <body className="font-sans">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
