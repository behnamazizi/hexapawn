self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('v1').then((cache) => cache.addAll([
            '/hexapawn/',
            '/hexapawn/index.html',
            '/hexapawn/css/style.css',
            '/hexapawn/js/script.js',

        ]))
    )
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});