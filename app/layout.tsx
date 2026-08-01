import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppProviders } from "@/app/providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RESTNEST | Find a Place to Feel at Home",
    template: "%s | RESTNEST",
  },
  description:
    "Discover rental properties, submit rental requests, manage listings, and complete secure payments with RESTNEST.",
  applicationName: "RESTNEST",
  keywords: [
    "RESTNEST",
    "rental properties",
    "property marketplace",
    "homes for rent",
    "tenant dashboard",
    "landlord dashboard",
  ],
  category: "real estate",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#f6f2ea",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#171914",
    },
  ],
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}