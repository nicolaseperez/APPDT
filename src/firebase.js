import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// La mayoría de estos valores son públicos por naturaleza en Firebase.
// Solo mantenemos la API KEY como secreta para evitar alertas de seguridad.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "appdtfirebase.firebaseapp.com",
    projectId: "appdtfirebase",
    storageBucket: "appdtfirebase.firebasestorage.app",
    messagingSenderId: "672765118501",
    appId: "1:672765118501:web:d7142ed0049509efbf57cc",
    measurementId: "G-KSE478TCZC"
};

// Debug para verificar que la API KEY llegue
if (!firebaseConfig.apiKey) {
    console.error("Firebase API Key is still missing from Vercel Env Vars.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
