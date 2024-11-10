const CACHE_NAME = 'portfolio-cache-v2';
const precachedAssets = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/image.jpg',
    '/image-icon.png',
    '/app.js',
    '/manifest.json',
    '/image1.png',
    '/image2.png',
    '/firebase-messaging-sw.js'
];

self.addEventListener('install', (event) => {
    console.log("Service Worker: Install Event");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service Worker: Precaching App Shell");
            return cache.addAll(precachedAssets);
        }).catch((error) => {
            console.error("Cache addAll failed: ", error);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log("Activating new service worker..."); // Debug log
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`Menghapus cache lama: ${cacheName}`); // Log untuk setiap cache yang dihapus
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log("Cache lama sudah dibersihkan.");
        }).catch((error) => {
            console.error("Error during cache deletion:", error);
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Periksa apakah metode permintaan adalah GET
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        // Simpan hanya respon GET di cache
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
    } else {
        // Untuk permintaan non-GET, langsung fetch tanpa caching
        event.respondWith(fetch(event.request));
    }
});
