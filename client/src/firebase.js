// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-blog-73630.firebaseapp.com",
  projectId: "mern-blog-73630",
  storageBucket: "mern-blog-73630.firebasestorage.app",
  messagingSenderId: "523222904811",
  appId: "1:523222904811:web:f77050bb1a7b712d03f3ae",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
