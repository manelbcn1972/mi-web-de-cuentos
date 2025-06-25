// ----------------------------------------------------------------
// --- PASO CLAVE 1: Configuración de Firebase ---
// ----------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyC9UIreovgnWHpwYT_idZSAvm0JlyPk6Ok",
  authDomain: "petstories-app.firebaseapp.com",
  projectId: "petstories-app",
  storageBucket: "petstories-app.firebasestorage.app",
  messagingSenderId: "90799928498",
  appId: "1:90799928498:web:d503295ddaec2822dd45ab",
  measurementId: "G-D4Y7D0VDSW"
};

// ----------------------------------------------------------------
// --- PASO CLAVE 2: Tu clave de API de Google AI Studio ---
// ----------------------------------------------------------------
const googleApiKey = "AIzaSyBr3ANRwaE3WFwLgfFVi8qvWf5sESdJPAA";

// Inicialización de Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Referencias a elementos del DOM
const storyForm = document.getElementById('story-form');
const generateBtn = document.getElementById('generate-btn');
const ebookContainer = document.getElementById('ebook-container');
const ebookContent = document.getElementById('ebook-content');
const loadingView = document.getElementById('loading-view');
const loadingMessage = document.getElementById('loading-message');
const petImageInput = document.getElementById('pet_image');
const imagePreview = document.getElementById('image_preview');
const characterDescGroup = document.getElementById('character_desc_group');
const characterDescInput = document.getElementById('character_desc');
const suggestPlotBtn = document.getElementById('suggest-plot-btn');
const plotSuggestionsContainer = document.getElementById('plot-suggestions');
const plotInput = document.getElementById('plot');
const flipbookModal = document.getElementById('flipbook-modal');
const flipbookContainer = document.getElementById('flipbook-container');
const closeFlipbookBtn = document.getElementById('close-flipbook');
const loginBtn = document.getElementById('login-btn');
const userProfile = document.getElementById('user-profile');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const logoutDropdown = document.getElementById('logout-dropdown');
const logoutBtn = document.getElementById('logout-btn');
const greeting = document.getElementById('greeting');

let currentPage = 0;
let totalPages = 0;
let storyPagesData = [];

// ✅ NUEVA función para manejar la vista de carga
function setLoading(isLoading) {
    if (loadingView && ebookContent) {
        loadingView.style.display = isLoading ? 'flex' : 'none';
        ebookContent.style.display = isLoading ? 'none' : 'block';
    }
}

// Ejemplo de cuento precargado
const preloadedStory = {
    title: "Lara la Exploradora",
    pages: [
        { text: "En el corazón de un jardín lleno de secretos, vivía Lara...", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+1" },
        { text: "Un día, mientras cavaba cerca de las rosas de su dueña...", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+2" },
        { text: "Dentro, enrollado y atado con una enredadera seca, había un mapa...", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+3" },
        { text: "El mapa prometía el camino al 'Tesoro Perdido de los Ladridos'...", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+4" },
        { text: "Los topos, que eran los gruñones guardianes de la montaña...", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+5" },
        { text: "Luego, llegó al Arroyo Susurrante, que en realidad era el goteo...", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+6" },
        { text: "El mapa la llevó finalmente a un viejo roble en la esquina...", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+7" },
        { text: "Y allí estaba. No era oro ni joyas. El Tesoro Perdido era un hueso...", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+8" },
    ]
};

// Cuentos de ejemplo
const exampleStories = {
    'example-lara': preloadedStory,
    'example-max': { character: 'Max', character_desc: 'Un gato negro...', setting: 'La luna...', plot: 'Aburrido de los juguetes...', style: 'dibujos animados', reading_level: '3 a 6 años' },
    'example-rocky': { character: 'Rocky', character_desc: 'Un hamster detective...', setting: 'Ciudad de tubos...', plot: 'Ha desaparecido una galleta...', style: 'cuento clásico', reading_level: '7 a 12 años' }
};

// Autenticación
auth.onAuthStateChanged(user => {
    if (user) {
        loginBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        userAvatar.src = user.photoURL;
        userName.textContent = user.displayName.split(' ')[0];
        greeting.textContent = `¡Hola, ${user.displayName.split(' ')[0]}!`;
    } else {
        loginBtn.style.display = 'block';
        userProfile.style.display = 'none';
        greeting.textContent = "¡Hola!";
    }
});

loginBtn.addEventListener('click', () => {
    auth.signInWithRedirect(provider).catch(error => {
        console.error("Error during sign in:", error);
    });
});

userProfile.addEventListener('click', () => {
    logoutDropdown.classList.toggle('hidden');
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().catch(error => console.error("Error during sign out:", error));
});

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    storyPagesData = preloadedStory.pages;
    renderEbook(preloadedStory.title, storyPagesData);
    setLoading(false);
    ebookContent.style.display = 'block';
    loadingView.style.display = 'none';
});
