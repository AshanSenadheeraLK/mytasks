/**
 * MyTasks Service Worker
 * Provides offline capabilities and caching of application assets
 */
/// <reference lib="webworker" />

import { manifest, version } from '@angular/service-worker/config';

const CACHE_NAME = `app-cache-${version}`;
const OFFLINE_URL = '/offline.html';

// Add list of essential files to cache
const ESSENTIAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Cache essential resources first
      try {
        await cache.addAll(ESSENTIAL_RESOURCES);
      } catch (error) {
        console.error('Failed to cache essential resources:', error);
      }

      // Then try to cache other resources from the manifest
      if (manifest) {
        const manifestUrls = Object.keys(manifest);
        for (const url of manifestUrls) {
          try {
            await cache.add(url);
          } catch (error) {
            console.warn(`Failed to cache resource ${url}:`, error);
            // Continue caching other resources even if one fails
            continue;
          }
        }
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('app-cache-'))
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - handle requests and provide offline content when needed
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests like those for Firebase
  if (event.request.url.indexOf(self.location.origin) !== 0 ||
      event.request.url.includes('firebase') ||
      event.request.url.includes('firestore')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Don't cache responses that aren't successful or aren't GET requests
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response since it can only be consumed once
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          try {
            cache.put(event.request, responseToCache);
          } catch (error) {
            console.warn('Failed to cache response:', error);
          }
        });

        return response;
      }).catch((error) => {
        console.error('Fetch failed:', error);
        // Return a fallback response or let the error propagate
        throw error;
      });
    })
  );
});
