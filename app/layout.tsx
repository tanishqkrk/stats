import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Space_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Stats for Tanishq",
  description: "Track and analyze performance metrics in real-time",
  keywords: ["dashboard", "analytics", "performance", "metrics", "statistics"],
  authors: [{ name: "Tanishq Kaushal" }],
  viewport: "width=device-width, initial-scale=1.0",
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Performance Dashboard",
    description: "Track and analyze performance metrics in real-time",
    type: "website",
    locale: "en_US",
    siteName: "Performance Dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className=" bg-black">
      <body className={`${geistSans.className}  antialiased`}>{children}</body>
    </html>
  );
}
