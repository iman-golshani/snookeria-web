SNOOKERIA ICON PACK

Next.js App Router:
- Copy favicon.ico to src/app/favicon.ico
- Copy apple-touch-icon.png to src/app/apple-icon.png
- Copy icon-192.png to public/icons/icon-192.png
- Copy icon-512.png to public/icons/icon-512.png
- Copy icon-512-maskable.png to public/icons/icon-512-maskable.png

In public/manifest.webmanifest (or existing manifest), use icons:
{"src":"/icons/icon-192.png","sizes":"192x192","type":"image/png","purpose":"any"}
{"src":"/icons/icon-512.png","sizes":"512x512","type":"image/png","purpose":"any"}
{"src":"/icons/icon-512-maskable.png","sizes":"512x512","type":"image/png","purpose":"maskable"}

If your project uses different icon paths, adjust accordingly.
PWA icons may be cached; reinstall PWA or clear site cache to see updates.
