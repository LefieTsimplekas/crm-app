// Leads CRM – service worker: πάντα η πιο πρόσφατη έκδοση από το δίκτυο· αντίγραφο μόνο αν δεν υπάρχει σύνδεση.
const CACHE = "leads-crm-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;   // Supabase, CDN κ.λπ. περνούν κανονικά
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(r => r || caches.match("./"))));
});
