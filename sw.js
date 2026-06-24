// Service Worker para funcionalidade offline
const CACHE_NAME = 'aprova-sp-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Fraunces:ital,wght@0,600;0,700;0,800;1,600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando assets');
        return cache.addAll(ASSETS);
      })
      .catch((err) => console.error('[SW] Erro ao cachear:', err))
  );
  self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        );
      })
  );
  self.clients.claim();
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Ignorar requisições externas
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(event.request)
          .then((response) => {
            // Não cachear erros
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone e salva no cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
            return response;
          })
          .catch((err) => {
            console.error('[SW] Fetch failed:', err);
            // Retorna offline page se disponível
            return caches.match('/index.html');
          });
      })
  );
});