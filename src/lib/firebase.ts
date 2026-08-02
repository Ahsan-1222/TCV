import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC0Aqg8hfFVg5e8sw0F3Bx3sS-BJY1QFvY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tcv-store.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tcv-store",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tcv-store.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "113831631628",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:113831631628:web:467e18659bcae09b7b4729",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-23ZZK41H9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("🔥 Firebase is successfully connected! App Name:", app.name);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firestore collections blueprint:
export const collections = {
  products: "products",
  orders: "orders",
  users: "users",
  wishlists: "wishlists",
};

// Auth roles
export const ROLES = {
  admin: "admin",
  customer: "customer",
};
