var cacheName = 'ahtishamclasses-v1';
var cacheFiles = [
    'index.html',
    'ahtishamclasses.webmanifest',
    'Images/art&craft.jpg',
    'Images/athlon.png',
    'Images/basketball.jpg',
    'Images/boxer.jpg',
    'Images/cricket.jpg',
    'Images/cybersecurity.jpg',
    'Images/football.jpg',
    'Images/karate.jpg',
    'Images/programming.jpg',
    'Images/swimming.jpg',
    'Images/icon-store-512.png',
    'Images/tableTennis.jpg',
    '/backend/server.js'
    
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
        })
    );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // If the requested resource is found in cache, return it
            if (response) {
                return response;
            }
            // Otherwise, fetch the resource from the network
            return fetch(event.request)
                .then(function(response) {
                    // Check if the response is valid and cacheable
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    // Clone the response to cache it
                    var responseToCache = response.clone();
                    caches.open(cacheName).then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(function(error) {
                    console.error('[Service Worker] Fetch error:', error);
                    // Return a response indicating the fetch failed
                    return new Response('Fetch failed');
                });
        })
    );
});