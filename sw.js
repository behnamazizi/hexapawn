const CacheName = '0_50_18_Mar_21';
const assets = [
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
];

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CacheName)
        .map(key => caches.delete(key))
      );
    }));
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});