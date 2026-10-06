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

    background_color: "#c90024",
    theme_color: "#c90024",

    orientation: "portrait",

    lang: "fa",
    dir: "rtl",

    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}