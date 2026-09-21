import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://snookeria.ir"),

  title: {
    default: "آکادمی اسنوکریا | آموزش اسنوکر با ایمان گلشنی",
    template: "%s | آکادمی اسنوکریا",
  },

  description:
    "آکادمی اسنوکریا به مدیریت و مربیگری ایمان گلشنی، مربی و داور رسمی فدراسیون؛ آموزش تخصصی اسنوکر، تمرین، آنالیز بازی و کوچینگ بازیکنان.",

  keywords: [
    "ایمان گلشنی",
    "اسنوکریا",
    "آکادمی اسنوکریا",
    "آموزش اسنوکر",
    "مربی اسنوکر",
    "آموزش بیلیارد",
    "مربی بیلیارد",
    "کلاس اسنوکر",
    "آموزش تخصصی اسنوکر",
  ],

  authors: [
    {
      name: "ایمان گلشنی",
      url: "https://snookeria.ir",
    },
  ],

  creator: "ایمان گلشنی",
  publisher: "آکادمی اسنوکریا",

  alternates: {
    canonical: "https://snookeria.ir",
  },

  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://snookeria.ir",
    siteName: "آکادمی اسنوکریا",
    title: "آکادمی اسنوکریا | آموزش اسنوکر با ایمان گلشنی",
    description:
      "آکادمی اسنوکریا؛ مدرسه تخصصی اسنوکر با مربیگری ایمان گلشنی، مربی و داور رسمی فدراسیون.",
    images: [
      {
        url: "/snookeria-logo.png",
        width: 512,
        height: 512,
        alt: "لوگوی آکادمی اسنوکریا",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "آکادمی اسنوکریا | آموزش اسنوکر با ایمان گلشنی",
    description:
      "آموزش تخصصی اسنوکر، تمرین، آنالیز بازی و کوچینگ بازیکنان در آکادمی اسنوکریا.",
    images: ["/snookeria-logo.png"],
  },

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#071426",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#071426] text-white antialiased">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}