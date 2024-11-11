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

// Fungsi untuk menampilkan notifikasi
function showNotification() {
  const title = 'Hallo!';
  const options = {
    body: 'Selamat Datang di Web Portofolio Mufida. Terimakasih telah mengunjungi!',
    icon: '/image-icon.png'
  };

  // Menampilkan notifikasi
  self.registration.showNotification(title, options);
}

// Event listener untuk pesan dari aplikasi utama
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    showNotification(); // Panggil fungsi untuk menampilkan notifikasi
  }
});

// Event listener untuk menangani klik pada notifikasi
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Menutup notifikasi saat diklik
  event.waitUntil(
    clients.openWindow('https://mufidra.github.io/Portofolio-PWA/') // URL yang akan dibuka saat notifikasi diklik
  );
});

// Optional: jika Anda ingin mendukung push notifications
self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/image-icon.png',
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
