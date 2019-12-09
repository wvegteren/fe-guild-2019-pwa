
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker ...', event);
    return self.clients.claim();
});

// self.addEventListener('fetch', event => {
//     console.log('[Service Worker] Fetching something ....', event);
//     // This fixes a weird bug in Chrome when you open the Developer Tools
//     if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
//         return; }
//     event.respondWith(fetch(event.request));
// });

const CACHE_STATIC_NAME = 'static_v3'; const URLS_TO_PRECACHE = [
    '/',
    'index.html',
    'offline.html',
    'help/index.html',
    'src/js/app.js',
    'src/js/feed.js',
    'src/lib/material.min.js',
    'src/css/app.css',
    'src/css/feed.css',
    'src/images/main-image.jpg', 'https://fonts.googleapis.com/css?family=Roboto:400,700', 'https://fonts.googleapis.com/icon?family=Material+Icons',
// 'https://code.getmdl.io/1.3.0/material.indigo-deep_orange.min.css"'
];
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker ...', event); event.waitUntil(
        caches.open(CACHE_STATIC_NAME) .then(cache => {
            console.log('[Service Worker] Precaching App Shell');
            cache.addAll(URLS_TO_PRECACHE); })
            .then(() => {
                console.log('[ServiceWorker] Skip waiting on install'); return self.skipWaiting();
            }) );
})

// self.addEventListener('fetch', event => {
//     console.log('[Service Worker] Fetching something ....', event);
//     event.respondWith(
//         caches.match(event.request)
//             .then(response => {
//                 if (response) {
//                     console.log(response);
//                     return response;
//                 }
//                 return fetch(event.request);
//             })
//     ); });

// Add a new cache for dynamic content
const CACHE_DYNAMIC_NAME = 'dynamic_v1';
self.addEventListener('fetch', event => {
    console.log('****' + event.request);
    console.log('[Service Worker] Fetching something ....', event); event.respondWith(
        caches.match(event.request) .then(response => {
            if (response) {
                return response; }
// Clone the request - a request is a stream and can be only consumed once
            const requestToCache = event.request.clone(); return fetch(requestToCache)
                .then(response => {
                    if (!response || response.status !== 200) {
                        return response; }
// Again clone the response because you need to add it into the cache
                    const responseToCache = response.clone(); caches.open(CACHE_DYNAMIC_NAME)
                        .then(cache => {
                            cache.put(requestToCache, responseToCache);
                        });
                    return response;
                }) })
            .catch(error => {
                return caches.open(CACHE_STATIC_NAME)
                    .then(cache => {
                        if (event.request.headers.get('accept').includes('text/html')) {
                            // return cache.match('/fe-guild-2019-pwa/offline.html'); uncomment for GitHub Pages
                            return cache.match('/fe-guild-2019-pwa/offline.html');
                        }
                    }); })
    );
});

self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker ...', event);
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_STATIC_NAME && cacheName !== CACHE_DYNAMIC_NAME) {
                        console.log('[Service Worker] Removing old cache.', cacheName);
                        return caches.delete(cacheName);
                    } }));
            })
            .then(() => {
                console.log('[ServiceWorker] Claiming clients');
                return self.clients.claim();
            })
    ); });
