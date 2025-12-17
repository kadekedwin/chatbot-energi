import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// IMPORT PENTING:
import { AuthProvider } from "@/contexts/AuthContext";

// Konfigurasi Font (Sesuaikan jika nama file font Anda berbeda)
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EnerNova - AI Research Platform",
  description: "Platform AI untuk riset energi terbarukan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* DISINI KUNCINYA: AuthProvider harus membungkus {children} */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}