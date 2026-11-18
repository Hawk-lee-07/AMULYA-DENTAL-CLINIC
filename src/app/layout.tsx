import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clinicConfig } from "@/config/clinicConfig";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f766e",
};

export const metadata: Metadata = {
  title: `${clinicConfig.clinicName} | ${clinicConfig.tagline}`,
  description: clinicConfig.shortDescription,
  keywords: [
    "Amulya Dental Clinic",
    "Dental Clinic",
    "Skin Clinic",
    "Root Canal Treatment",
    "Dental Implants",
    "Teeth Whitening",
    "Hydra Facial",
    "Dentist in Delhi",
    "Cosmetic Dentistry",
  ],
  authors: [{ name: clinicConfig.doctor.name }],
  openGraph: {
    title: `${clinicConfig.clinicName} - Dental & Skin Care`,
    description: clinicConfig.shortDescription,
    url: "https://amulyadental.com",
    siteName: clinicConfig.clinicName,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
