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
    navigator.serviceWorker.register('/sw.js').then(reg => {
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

        // Upgrade needed to create object store
        request.onupgradeneeded = (event) => {
            console.log('onupgradeneeded: Creating object store');
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                console.log(`Object store "${storeName}" created.`);
            }
        };

        request.onsuccess = (event) => {
            console.log('Database opened successfully');
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject(`Database error: ${event.target.errorCode}`);
        };
    });
}

// Add contact data to IndexedDB
async function addContact(contact) {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    store.add(contact);

    tx.oncomplete = () => {
        console.log('Contact added to IndexedDB:', contact);
        getAllContacts(); // Retrieve and log all contacts after adding a new one
    };

    tx.onerror = (event) => {
        console.error('Error adding contact:', event.target.error);
    };
}

// Retrieve all contacts from IndexedDB
async function getAllContacts() {
    const db = await openDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    
    const request = store.getAll();

    request.onsuccess = (event) => {
        console.log('All contacts:', event.target.result);
    };

    request.onerror = (event) => {
        console.error('Error retrieving contacts:', event.target.error);
    };
}

// Save contact from the form
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Retrieve form data
    const contact = {
        name: document.querySelector('input[placeholder="Full Name"]').value,
        email: document.querySelector('input[placeholder="Email"]').value,
        phone: document.querySelector('input[placeholder="Phone Number"]').value,
        subject: document.querySelector('input[placeholder="Subject"]').value,
        message: document.querySelector('textarea[placeholder="Your Message"]').value
    };
    
    addContact(contact); // Save contact to IndexedDB
    alert("Contact saved to database!");

    // Clear the form fields after saving
    document.querySelector('input[placeholder="Full Name"]').value = '';
    document.querySelector('input[placeholder="Email"]').value = '';
    document.querySelector('input[placeholder="Phone Number"]').value = '';
    document.querySelector('input[placeholder="Subject"]').value = '';
    document.querySelector('textarea[placeholder="Your Message"]').value = '';
});

// Test database initialization on page load
window.onload = () => {
    openDatabase().then(() => {
        console.log('IndexedDB should be initialized now.');
        getAllContacts();
    }).catch(error => {
        console.error('IndexedDB initialization failed:', error);
    });
};

// Call getAllContacts to display data in console
getAllContacts();
