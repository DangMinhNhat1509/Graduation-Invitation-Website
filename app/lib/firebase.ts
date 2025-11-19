// lib/firebase.ts
"use client"; // nếu bạn cần dùng trên client component

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Lấy config từ env (không lộ key trên github)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT!,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE!,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT!,
};

// Khởi tạo app Firebase, tránh re-init khi HMR (Hot Module Reload)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Firestore
export const db = getFirestore(app);

// Analytics (chỉ trên browser)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}
