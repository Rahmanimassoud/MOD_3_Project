// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mod-3-340c4.firebaseapp.com",
  projectId: "mod-3-340c4",
  storageBucket: "mod-3-340c4.appspot.com",
  messagingSenderId: "1070701112832",
  appId: "1:1070701112832:web:eb65f8fc236e864266f2e5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);