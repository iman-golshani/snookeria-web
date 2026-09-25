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
    "آکادمی اسنوکریا به مدیریت و مربیگری ایمان گلشنی، مربی و داور رسمی فدراسیون؛ آموزش تخصصی اسنوکر، تمرین، آنالیز بازی، کوچینگ بازیکنان و مسابقات اسنوکر.",

  keywords: [
    "ایمان گلشنی",
    "اسنوکریا",
    "Snookeria",
    "آکادمی اسنوکریا",
    "آموزش اسنوکر",
    "مربی اسنوکر",
    "آموزش بیلیارد",
    "مربی بیلیارد",
    "کلاس اسنوکر",
    "آموزش تخصصی اسنوکر",
    "مسابقات اسنوکر",
    "شوت اوت",
    "مسابقات شوت اوت",
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

  manifest: "/manifest.webmanifest",

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
        url: "/snookeria-icon-1024.png",
        width: 1024,
        height: 1024,
        alt: "لوگوی آکادمی اسنوکریا",
      },
    ],
  },

  twitter: {
    card: "summary",

    title: "آکادمی اسنوکریا | آموزش اسنوکر با ایمان گلشنی",

    description:
      "آموزش تخصصی اسنوکر، تمرین، مسابقات، آنالیز بازی و کوچینگ بازیکنان در آکادمی اسنوکریا.",

    images: ["/snookeria-icon-1024.png"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    shortcut: "/favicon.ico",
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
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="bg-[#071426]">
      <body className="min-h-screen bg-[#071426] text-white antialiased">
        {children}

        <BottomNav />
      </body>
    </html>
  );
}