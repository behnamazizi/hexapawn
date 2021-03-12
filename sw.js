self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('v1').then((cache) => cache.addAll([
            '/hexapawn/',
            '/hexapawn/index.html',
            '/hexapawn/snd/drag.mp3',
            '/hexapawn/snd/drop.mp3',
            '/hexapawn/snd/lost.wav',
            '/hexapawn/snd/win.wav',
            '/hexapawn/img/fav.png',
            '/hexapawn/css/style.css',

        ]))
    )
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});