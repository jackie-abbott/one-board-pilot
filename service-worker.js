// Fresh HTML (network-first) + cache cleanup
const CACHE = "one-board-pilot-v3";

self.addEventListener("install", (e) => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  const accept = req.headers.get("accept") || "";

  // Network-first for navigations/HTML so new CSS/vars appear immediately
  const isHTML = req.mode === "navigate" || accept.includes("text/html");
  if (url.origin === location.origin && isHTML) {
    e.respondWith(
      fetch(req, { cache: "no-store" })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Everything else: cache-first
  e.respondWith(caches.match(req).then((res) => res || fetch(req)));
});
