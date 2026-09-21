import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snookeria | آکادمی اسنوکریا",
  description:
    "آکادمی اسنوکریا؛ آموزش، مسابقات، بازیکنان، اخبار و دنیای حرفه‌ای اسنوکر",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}