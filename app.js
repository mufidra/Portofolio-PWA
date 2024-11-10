// Menu toggle for mobile responsiveness
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Close the mobile menu when a link is clicked
const navLinks = document.querySelectorAll('.navbar a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});
// Pilih semua link di dalam navbar
const navbarLinks = document.querySelectorAll('.navbar a');

// Fungsi untuk menambahkan class 'active' pada link yang diklik
function setActiveLink() {
    navbarLinks.forEach(link => {
        // Hapus 'active' dari semua link
        link.classList.remove('active');
    });
    // Tambahkan 'active' pada link yang diklik
    this.classList.add('active');
}

// Tambahkan event listener pada setiap link
navbarLinks.forEach(link => {
    link.addEventListener('click', setActiveLink);
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        console.log('Service Worker registered:', reg);
    }).catch(err => console.error('Service Worker registration failed:', err));
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installButton').style.display = 'flex';
});

document.getElementById('installButton').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        document.getElementById('installButton').style.display = 'none';
    }
});

// IndexedDB initialization with "contactDB" as the only database name
const dbName = 'contactDB';
const storeName = 'contacts';

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            console.log("onupgradeneeded dipanggil");

            // Cek apakah object store sudah ada; jika belum, buat
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                console.log(`Object store "${storeName}" dibuat.`);
            } else {
                console.log(`Object store "${storeName}" sudah ada.`);
            }
        };

        request.onsuccess = (event) => {
            console.log('Database berhasil dibuka');
            resolve(event.target.result); // Mengembalikan database
        };

        request.onerror = (event) => {
            console.error('Kesalahan database:', event.target.errorCode);
            reject(`Kesalahan database: ${event.target.errorCode}`);
        };
    });
}

// Fungsi untuk menambahkan kontak ke IndexedDB
async function addContact(contact) {
    try {
        const db = await openDatabase();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        store.add(contact);

        tx.oncomplete = () => {
            console.log('Kontak ditambahkan ke IndexedDB:', contact);
            getAllContacts();
        };

        tx.onerror = (event) => {
            console.error('Kesalahan saat menambahkan kontak:', event.target.error);
        };
    } catch (error) {
        console.error("Kesalahan saat menambahkan kontak:", error);
    }
}

// Fungsi untuk mengambil semua kontak dari IndexedDB
async function getAllContacts() {
    try {
        const db = await openDatabase();
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);

        const request = store.getAll();

        request.onsuccess = (event) => {
            console.log('Semua kontak:', event.target.result);
        };

        request.onerror = (event) => {
            console.error('Kesalahan saat mengambil kontak:', event.target.error);
        };
    } catch (error) {
        console.error("Kesalahan saat mengambil kontak:", error);
    }
}

// Menyimpan kontak dari form
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();

    const contact = {
        name: document.querySelector('input[placeholder="Full Name"]').value,
        email: document.querySelector('input[placeholder="Email"]').value,
        phone: document.querySelector('input[placeholder="Phone Number"]').value,
        subject: document.querySelector('input[placeholder="Subject"]').value,
        message: document.querySelector('textarea[placeholder="Your Message"]').value
    };

    addContact(contact);
    alert("Kontak berhasil disimpan ke database!");

    // Reset form
    document.querySelector('form').reset();
});

// Inisialisasi database pada saat halaman dimuat
window.onload = () => {
    openDatabase().then(() => {
        console.log('IndexedDB seharusnya sudah terinisialisasi sekarang.');
        getAllContacts();
    }).catch(error => {
        console.error('Inisialisasi IndexedDB gagal:', error);
    });
};
// Call getAllContacts to display data in console
getAllContacts();
