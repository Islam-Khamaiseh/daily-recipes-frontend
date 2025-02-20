import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx99WiPtzhuxhvsOg5RK4Vbcz1XbuSp68",
  authDomain: "daily-recipes-3.firebaseapp.com",
  projectId: "daily-recipes-3",
  storageBucket: "daily-recipes-3.firebasestorage.app",
  messagingSenderId: "310208584908",
  appId: "1:310208584908:web:f7135d7289c7fbd48b3669",
  measurementId: "G-H741TK7Z92",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
