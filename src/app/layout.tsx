import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAVERICK | Premium Men's Clothing - Wholesale & Retail",
  description: "Discover premium men's fashion at MAVERICK. We offer exclusive wholesale and retail collections of suits, casual wear, formal attire, and accessories. Elevate your style with our curated selection.",
  keywords: ["MAVERICK", "Men's Clothing", "Wholesale Fashion", "Retail Clothing", "Menswear", "Suits", "Formal Wear", "Casual Wear", "Premium Fashion", "Men's Apparel"],
  authors: [{ name: "MAVERICK Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "MAVERICK | Premium Men's Clothing",
    description: "Exclusive wholesale and retail collections for the modern gentleman",
    url: "https://chat.z.ai",
    siteName: "MAVERICK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAVERICK | Premium Men's Clothing",
    description: "Exclusive wholesale and retail collections for the modern gentleman",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
