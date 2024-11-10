// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyDeyih0XS5OagXvdzqRkIuv8i7zI1wvfIA",
    authDomain: "portofolio-9f9aa.firebaseapp.com",
    projectId: "portofolio-9f9aa",
    storageBucket: "portofolio-9f9aa.firebasestorage.app",
    messagingSenderId: "513246485833",
    appId: "1:513246485833:web:74c1bbc050507c47564e98",
    measurementId: "G-VV29KXSFYN"
};

// Inisialisasi Firebase di service worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Mengelola pesan di latar belakang
messaging.onBackgroundMessage((payload) => {
    console.log('Pesan diterima di latar belakang:', payload);
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        image: payload.data.image,
    }
    self.registration.showNotification(notificationTitle, notificationOptions);
    self.addEventListener('notificationclick', function(event){
        const clickedNotification = event.notification
        clickedNotification.close();
        event.waitUntil(
            clients.openWindow(payload.data.click)
        )
    })
})

