import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CallPro Entec",
  description: "Register CallPro Entec",
  keywords: ["event", "registration", "form", "callpro", "entec"],
  openGraph: {
    title: "CallPro Entec",
    description: "Join our event",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-GIP min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
