self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('v1').then((cache) => cache.addAll([
            '/hexapawn/',
            '/hexapawn/index.html',
            '/hexapawn/css/style.css',
            '/hexapawn/js/script.js',
            '/hexapawn/img/icon48.png',
            '/hexapawn/img/icon72.png',
            '/hexapawn/img/icon96.png',
            '/hexapawn/img/icon144.png',
            '/hexapawn/img/icon168.png',
            '/hexapawn/img/icon192.png',
            '/hexapawn/img/icon256.png'

        ]))
    )
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});