"use client";

import { useEffect, useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT,
};

// init firebase
let db: any;
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  db = getFirestore();
}

const FALLBACK = { lat: 10.773374, lng: 106.660728 }; // Trường FPT fallback

export default function HostPage() {
  const [status, setStatus] = useState("Đang chờ định vị...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Thiết bị không hỗ trợ GPS. Đang dùng fallback.");
      setDoc(doc(db, "live", "host"), {
        lat: FALLBACK.lat,
        lng: FALLBACK.lng,
        updatedAt: Date.now(),
        usingFallback: true,
      });
      return;
    }

    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        setStatus("Đang phát vị trí real-time…");

        setDoc(doc(db, "live", "host"), {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          updatedAt: Date.now(),
          usingFallback: false,
        });
      },
      () => {
        setStatus("GPS bị tắt → đang dùng fallback (trường FPT)");
        setDoc(doc(db, "live", "host"), {
          lat: FALLBACK.lat,
          lng: FALLBACK.lng,
          updatedAt: Date.now(),
          usingFallback: true,
        });
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-3">🔴 Host Location Active</h1>
      <p>{status}</p>
      <p className="mt-3 text-gray-500 text-sm">
        (Bạn phải mở trang này để khách thấy vị trí của bạn)
      </p>
    </div>
  );
}
