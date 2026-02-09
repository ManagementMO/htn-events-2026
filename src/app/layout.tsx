import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { QueryProvider } from "@/context/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HTN Events | Hack the North 2026",
  description:
    "Browse workshops, tech talks, and activities at Hack the North 2026 — Canada's biggest hackathon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="flex min-h-screen flex-col bg-[#05060f] text-slate-100 antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
