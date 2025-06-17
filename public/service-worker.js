/**
 * MyTasks Service Worker
 * Provides offline capabilities and caching of application assets
 */
const CACHE_NAME = 'mytasks-cache-v2';
const OFFLINE_URL = '/offline.html';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/main.js',
  '/polyfills.js',
  '/runtime.js',
  '/manifest.webmanifest',
  '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching Static Assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => {
          console.log('[Service Worker] Removing Old Cache', name);
          return caches.delete(name);
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - handle requests and provide offline content when needed
self.addEventListener('fetch', event => {
  // Skip cross-origin requests like those for Firebase
  if (event.request.url.indexOf(self.location.origin) !== 0 ||
      event.request.url.includes('firebase') ||
      event.request.url.includes('firestore')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(response => {
          // Don't cache responses that aren't successful
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Open the cache and store the response
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        })
        .catch(error => {
          console.log('[Service Worker] Fetch Failed. Returning Offline Page', error);
          return caches.match(OFFLINE_URL);
        });
    })
  );
}); 