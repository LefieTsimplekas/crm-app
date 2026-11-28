const scope = new URL(self.registration.scope);
const cacheName = 'leads-crm-react-v1:' + scope.pathname;
const assets = new URL('assets/', scope).pathname;

self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key.startsWith('leads-crm-react-') && key.endsWith(':' + scope.pathname) && key !== cacheName,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  const navigation =
    request.mode === 'navigate' && [scope.pathname, scope.pathname + 'index.html'].includes(url.pathname);
  if (request.method !== 'GET' || url.origin !== scope.origin || (!navigation && !url.pathname.startsWith(assets)))
    return;
  const key = navigation ? scope.href : request;
  event.respondWith(
    caches.open(cacheName).then(async (cache) => {
      if (!navigation) {
        const cached = await cache.match(key);
        if (cached) return cached;
      }
      try {
        const response = await fetch(request);
        if (response.ok && !response.redirected) await cache.put(key, response.clone()).catch(() => undefined);
        return response;
      } catch {
        return (await cache.match(key)) ?? Response.error();
      }
    }),
  );
});
