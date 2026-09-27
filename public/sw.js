const CACHE_NAME = "snookeria-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

/*
 * فعلاً عمداً Fetch Handler نداریم.
 *
 * دلیل:
 * صفحات Live و اطلاعات مسابقات نباید Cache شوند.
 *
 * بعداً می‌توانیم فقط Assetهای ثابت مثل:
 * Logo
 * Icons
 * CSS
 * Fonts
 * را Cache کنیم.
 */