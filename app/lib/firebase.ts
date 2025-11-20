// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config từ env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT!,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE!,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT!,
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
