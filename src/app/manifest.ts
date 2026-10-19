import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Snookeria Academy",
    short_name: "Snookeria",

    description:
      "آکادمی اسنوکریا - مدرسه تخصصی آموزش اسنوکر، مسابقات و کارگاه‌های آموزشی",

    start_url: "/",
    scope: "/",

    display: "standalone",

    background_color: "#ffffff",
    theme_color: "#ffffff",

    orientation: "portrait",

    lang: "fa",
    dir: "rtl",

    icons: [
      { src: "/snookeria-official-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/snookeria-official-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/snookeria-official-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/snookeria-official-square.jpg", sizes: "1254x1254", type: "image/jpeg", purpose: "any" },
    ],
  };
}