// service-worker.js  (v4)
const CACHE = "one-board-pilot-v4";  // <-- bump this each time you ship

self.addEventListener("install", (event) => {
  // Activate immediately so the new SW takes control on first reload
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
      await self.clients.claim();
      // Helpful in DevTools console to confirm the new SW
      console.log("[SW] activated

