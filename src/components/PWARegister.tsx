"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          "/sw.js",
          {
            scope: "/",
          }
        );

        console.log(
          "Snookeria Service Worker registered:",
          registration.scope
        );
      } catch (error) {
        console.error(
          "Snookeria Service Worker registration failed:",
          error
        );
      }
    };

    void registerServiceWorker();
  }, []);

  return null;
}