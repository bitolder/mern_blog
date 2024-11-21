// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-estate-c6d83.firebaseapp.com",
  projectId: "mern-estate-c6d83",
  storageBucket: "mern-estate-c6d83.appspot.com",
  messagingSenderId: "86022766155",
  appId: "1:86022766155:web:859870b7c78f2422d9d7ce",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
