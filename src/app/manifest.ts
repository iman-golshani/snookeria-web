import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Snookeria Academy",
    short_name: "Snookeria",
    description: "آکادمی اسنوکریا - مدرسه تخصصی اسنوکر",
    start_url: "/",
    display: "standalone",
    background_color: "#071426",
    theme_color: "#071426",
    orientation: "portrait",
    icons: [
      {
        src: "/snookeria-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/snookeria-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}