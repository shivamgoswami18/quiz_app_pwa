self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('quiz-app-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/static/js/main.chunk.js',
        '/static/css/main.chunk.css',
        '/manifest.json',
        '/logo192.png',
        '/logo512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});