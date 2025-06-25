// ----------------------------------------------------------------
// --- PASO CLAVE 1: Configuración de Firebase ---
// Ve a la web de Firebase, entra en tu proyecto, ve a "Project Settings"
// y copia aquí el objeto `firebaseConfig` que te proporcionan.
// ----------------------------------------------------------------
// --- PASO CLAVE 1: Configuración de Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyC9UIreovgnWHpwYT_idZSAvm0JlyPk6Ok",
    authDomain: "petstories-app.firebaseapp.com",
    projectId: "petstories-app",
    storageBucket: "petstories-app.appspot.com",
    messagingSenderId: "90799928498",
    appId: "1:90799928498:web:d503295ddaec2822dd45ab"
};

// ----------------------------------------------------------------
// --- PASO CLAVE 2: Tu clave de API de Google AI Studio ---
// Reemplaza las comillas con tu clave, que puedes obtener en:
// https://aistudio.google.com/app/apikey
// ----------------------------------------------------------------
const googleApiKey = "AIzaSyBr3ANRwaE3WFwLgfFVi8qvWf5sESdJPAA";


// --- El resto del código funciona sin cambios ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

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
const preloadedStory = {
    title: "Lara la Exploradora",
    pages: [
        { text: "En el corazón de un jardín lleno de secretos, vivía Lara, una golden retriever con un espíritu más grande que su patio trasero. Su pelaje dorado brillaba bajo el sol, pero sus ojos siempre buscaban más allá de la valla, soñando con aventuras.", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+1" },
        { text: "Un día, mientras cavaba cerca de las rosas de su dueña, sus patas chocaron con algo duro. No era una piedra, sino un viejo cofre de madera. Con un ladrido de emoción, lo desenterró y lo abrió de un empujón con su nariz.", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+2" },
        { text: "Dentro, enrollado y atado con una enredadera seca, había un mapa. No era un mapa ordinario; estaba dibujado con tinta de bayas y mostraba lugares del jardín que Lara nunca había visto: la 'Montaña de los Topos' y el 'Arroyo Susurrante'.", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+3" },
        { text: "El mapa prometía el camino al 'Tesoro Perdido de los Ladridos'. Con la bandana roja ondeando como la capa de una superheroína, Lara se embarcó en su gran expedición. Su primera parada: la Montaña de los Topos.", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+4" },
        { text: "Los topos, que eran los gruñones guardianes de la montaña de tierra, no estaban contentos de verla. Pero Lara, con su encanto perruno, les ofreció una de sus pelotas de tenis a cambio de paso seguro. ¡El trueque funcionó!", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+5" },
        { text: "Luego, llegó al Arroyo Susurrante, que en realidad era el goteo constante del aspersor. Allí, tuvo que cruzar un puente resbaladizo (una tabla de madera) mientras era observada por una pandilla de ardillas curiosas.", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+6" },
        { text: "El mapa la llevó finalmente a un viejo roble en la esquina más alejada del jardín. Una 'X' gigante marcaba un lugar entre sus raíces. Lara comenzó a cavar con todas sus fuerzas, la tierra volaba por todas partes.", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+7" },
        { text: "Y allí estaba. No era oro ni joyas. El Tesoro Perdido de los Ladridos era un hueso de goma gigante, el más grande que Lara había visto jamás, y ¡todavía sonaba al apretarlo! Con su tesoro en la boca, regresó a casa, la exploradora más feliz del mundo.", imageUrl: "https://placehold.co/600x400/fecaca/991b1b?text=Página+8" },
    ]
};
const exampleStories = {
    'example-lara': preloadedStory,
    'example-max': { character: 'Max', character_desc: 'Un gato negro y sigiloso con brillantes ojos verdes y un collar con un pequeño cascabel que nunca suena.', setting: 'La luna, hecha de queso suizo, con cráteres llenos de leche y estrellas que son bolas de estambre.', plot: 'Aburrido de los juguetes terrestres, el gato Max construye un cohete con una caja de cartón y viaja a la luna. Allí, se hace amigo de los amistosos ratones lunares, que le enseñan a rebotar en la baja gravedad y a surfear en los ríos de leche.', style: 'estilo de dibujos animados alegres', reading_level: 'para niños de 3 a 6 años' },
    'example-rocky': { character: 'Rocky', character_desc: 'Un pequeño y regordete hamster de color marrón y blanco, con grandes mofletes y un sombrero de detective de papel.', setting: 'Una compleja ciudad de tubos de plástico y túneles dentro de una jaula, con una rueda de ejercicio como el centro de la ciudad.', plot: '¡Ha desaparecido la galleta más grande y deliciosa de la jaula! El astuto detective Rocky, sigue un rastro de migas y pistas para interrogar a los otros habitantes de la jaula y resolver el caso más sabroso de su carrera.', style: 'estilo libro de cuentos clásico', reading_level: 'para niños de 7 a 12 años' }
};
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
loginBtn.addEventListener('click', () => { auth.signInWithRedirect(provider).catch(error => { console.error("Error during sign in:", error); }); });
userProfile.addEventListener('click', () => { logoutDropdown.classList.toggle('hidden'); });
logoutBtn.addEventListener('click', (e) => { e.preventDefault(); auth.signOut().catch(error => console.error("Error during sign out:", error)); });
document.addEventListener('DOMContentLoaded', () => {
    storyPagesData = preloadedStory.pages;
    renderEbook(preloadedStory.title, storyPagesData);
    setLoading(false);
    ebookContent.style.display = 'block';
    loadingView.style.display = 'none';
});
// (El resto del código de funciones va aquí...)
