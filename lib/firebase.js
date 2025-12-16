// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj2N2LfgdWp1v7Gj1iSejHJt1nzyjKXuE",
  authDomain: "fir-ms-project.firebaseapp.com",
  projectId: "fir-ms-project",
  storageBucket: "fir-ms-project.firebasestorage.app",
  messagingSenderId: "161211374542",
  appId: "1:161211374542:web:86886d3e97f2c6149e699f",
  measurementId: "G-5QG20XFFTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Auth only - Firestore removed)
export const auth = getAuth(app);

// Initialize Analytics only in browser environment
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;

