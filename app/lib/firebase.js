// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
