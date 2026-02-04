import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD-9cZg_K78xr6EvX0W8TqOpQIbCbTytO8",
    authDomain: "appdtfirebase.firebaseapp.com",
    projectId: "appdtfirebase",
    storageBucket: "appdtfirebase.firebasestorage.app",
    messagingSenderId: "672765118501",
    appId: "1:672765118501:web:d7142ed0049509efbf57cc",
    measurementId: "G-KSE478TCZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
