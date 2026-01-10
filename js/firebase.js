// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCuP2P3y0qpLHBu9lh6NRIr-GDQaPYeJGs",
  authDomain: "vinetas-tabby.firebaseapp.com",
  projectId: "vinetas-tabby",
  storageBucket: "vinetas-tabby.firebasestorage.app",
  messagingSenderId: "58382313006",
  appId: "1:58382313006:web:5f22cd6680f80a957721bf"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
