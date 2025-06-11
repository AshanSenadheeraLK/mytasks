const CACHE_NAME = 'mytasks-cache-v2';
const OFFLINE_URL = '/offline.html';
const ASSETS = [
  '/',
  '/index.html',
  OFFLINE_URL,
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match(OFFLINE_URL));
    })
  );
});
