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
  title: "Premium Drop Shoulder T-shirt - Order Now | Fashion House",
  description: "Premium Quality Drop Shoulder T-shirt. Interlock & Rib Cotton (GSM 220). Stylish, comfortable, and skin-friendly. Order now for 490৳ with Free Delivery!",
  keywords: ["Drop Shoulder T-shirt", "Premium Cotton", "GSM 220", "Fashion House", "Men's Fashion BD", "T-shirt Order", "Wholesale & Retail"],
  authors: [{ name: "Fashion House Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Premium Drop Shoulder T-shirt - 490৳",
    description: "Premium Interlock & Rib Cotton (GSM 220). Order now with Free Delivery!",
    url: "https://chat.z.ai",
    siteName: "Fashion House",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Drop Shoulder T-shirt - 490৳",
    description: "Premium Interlock & Rib Cotton (GSM 220). Order now with Free Delivery!",
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
